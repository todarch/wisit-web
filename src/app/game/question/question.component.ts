import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  Choice,
  GameService,
  QuestionAnswer,
  QuestionType,
  SimpleQuestion,
  SimpleUserQuestion,
  UserQuestionAnswer
} from '../services/game.service';
import {ErrorResponse} from '../../shared/error-response';
import {OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../shared/loader/loader.component';
import {DynamicOverlayService} from '../../shared/services/dynamic-overlay.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {NotificationService} from '../../shared/services/notification.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() questionAnswered = new EventEmitter();
  @Output() newQuestionRequested = new EventEmitter();

  simpleQuestion = this.placeHolderQuestion();
  givenAnswer: Choice;
  correctAnswer: Choice;
  noMoreQuestions = false;
  answeredInSeconds: number;

  private userQuestionId;
  private answeringTimer;
  private questionType: QuestionType = QuestionType.CITIES_AS_CHOICES;

  @ViewChild('questionCard', { static: false, read: ElementRef }) card: ElementRef;

  private overlayRef: OverlayRef;

  constructor(private gameService: GameService,
              private authService: AuthService,
              private router: Router,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private datePipe: DatePipe,
              private dynamicOverlayService: DynamicOverlayService) { }

  ngOnInit(): void {
    console.log('on after on init', this.simpleQuestion.questionId);
  }

  ngOnDestroy() {
    if (this.answeringTimer) {
      clearInterval(this.answeringTimer);
    }
  }

  ngAfterViewInit() {
    // console.log('on after view init', this.card);
    this.fetchNewQuestion(false);
  }

  imageLoaded() {
    this.closeOverlay();
    this.startTimer();
  }

  public fetchNewQuestion(afterReporting: boolean) {
    this.newQuestionRequested.emit();
    if (this.authService.isGuest()) {
      this. newQuestion();
    } else {
      this.newUserQuestion(afterReporting);
    }
  }

  private newQuestion() {
    this.showOverlay();
    this.gameService.nextQuestion()
      .subscribe((simpleQuestion: SimpleQuestion) => {
          this.onNewQuestion(simpleQuestion);
          // overlay is closed after image is loaded
        },
        (error: ErrorResponse) => {
          if (error.httpStatusCode === 404) {
            this.onNewQuestion(this.placeHolderQuestion());
          }
          console.log(error);
        }
      );
  }

  private newUserQuestion(afterReporting: boolean) {
    this.showOverlay();
    this.gameService.nextUserQuestion(afterReporting)
      .subscribe((simpleUserQuestion: SimpleUserQuestion) => {
          this.userQuestionId = simpleUserQuestion.userQuestionId;
          this.onNewQuestion(simpleUserQuestion.preparedQuestion);
          // overlay is closed after image is loaded
        },
        (error: ErrorResponse) => {
          if (error.httpStatusCode === 404) {
            this.noMoreQuestions = true;
          }
          console.log(error);
          this.closeOverlay();
        }
      );
  }

  onNewQuestion(question: SimpleQuestion) {
    this.simpleQuestion = question;
    this.givenAnswer = null;
    this.correctAnswer = null;
  }

  onAnswer(givenAnswer: Choice) {
    if (this.authService.isGuest()) {
      this.answerQuestion(givenAnswer);
    } else {
      this.answerUserQuestion(givenAnswer);
    }
  }

  private answerUserQuestion(givenAnswer: Choice) {
    this.showOverlay();
    this.gameService.answerUserQuestion({
      userQuestionId: this.userQuestionId,
      answerQuestion: {
        questionId: this.simpleQuestion.questionId,
        cityId: givenAnswer.id,
        answeredInSeconds: this.answeredInSeconds,
        questionType: this.questionType
      }
    }).subscribe(
      (userQuestionAnswer: UserQuestionAnswer) => {
        const answer = userQuestionAnswer.questionAnswer;
        this.correctAnswer = answer.correctChoice;
        this.givenAnswer = answer.givenChoice;
        this.questionAnswered.emit({ question: this.simpleQuestion, answer });
        this.closeOverlay();
      },
      (error: ErrorResponse) => {
        this.closeOverlay();
        if (error.httpStatusCode === 404) {
          this.notificationService.onLeftBottom('Previous question was reported and removed.');
          this.fetchNewQuestion(true);
        }
      }
    );
  }

  private answerQuestion(givenAnswer: Choice) {
    this.showOverlay();
    this.gameService.answerQuestion({
      questionId: this.simpleQuestion.questionId,
      cityId: givenAnswer.id,
      answeredInSeconds: this.answeredInSeconds,
      questionType: this.questionType
    }).subscribe(
      (answer: QuestionAnswer) => {
        this.correctAnswer = answer.correctChoice;
        this.givenAnswer = answer.givenChoice;
        this.questionAnswered.emit({ question: this.simpleQuestion, answer});
        this.closeOverlay();
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.closeOverlay();
      }
    );
  }

  getButtonColor(choice: Choice) {
    if (!this.answered()) {
      return '';
    }
    if (choice.id === this.correctAnswer.id) {
      return 'primary';
    }
    if (this.givenAnswer.id === choice.id) {
      return 'warn';
    } else {
      return '';
    }
  }

  getButtonIcon(choice: Choice) {
    if (!this.answered()) {
      return 'crop_square';
    }
    if (choice.id === this.correctAnswer.id) {
      return 'check';
    }
    if (this.givenAnswer.id === choice.id) {
      return 'close';
    } else {
      return 'crop_square';
    }
  }

  public answered() {
    if (this.givenAnswer) {
      return true;
    } else {
      return false;
    }
  }

  next() {
    this.questionType = this.pickOne();
    this.fetchNewQuestion(false);
  }

  private pickOne(): QuestionType {
    switch (this.questionType) {
      case QuestionType.CITIES_AS_CHOICES:
        return  QuestionType.COUNTRIES_AS_CHOICES;
      case QuestionType.COUNTRIES_AS_CHOICES:
        return  QuestionType.CITIES_AS_CHOICES;
    }
  }

  showOverlay() {
      this.overlayRef = this.dynamicOverlayService.createWithDefaultConfig(this.card.nativeElement);
      this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  closeOverlay() {
    this.overlayRef.detach();
  }

  private placeHolderQuestion(): SimpleQuestion {
    return  {
      questionId: '',
      picId: 0,
      picUrl: '/assets/img/loading-placeholder.png',
      choices: [
        this.placeHolderChoice(),
        this.placeHolderChoice(),
        this.placeHolderChoice(),
        this.placeHolderChoice()
      ],
      createdAt: Date.now().toString(),
      answeredCount: 0
    };

  }

  private placeHolderChoice(): Choice {
    return {
      id: 1,
      cityName: 'Loading',
      countryName: 'Loading'
    };
  }

  startTimer() {
    this.answeredInSeconds = 0;
    this.answeringTimer = setInterval(() => {
      // console.log(this.answeringTimer);
      this.answeredInSeconds++;

      if (this.answered()) {
        clearInterval(this.answeringTimer);
        // console.log('answered in ' + this.answeringTimer + ' seconds');
      }
    }, 1000);
  }

  toChoiceValue(choice: Choice): string {
    switch (this.questionType) {
      case QuestionType.CITIES_AS_CHOICES:
        return choice.cityName;
      case QuestionType.COUNTRIES_AS_CHOICES:
        return choice.countryName;
    }
  }
}
