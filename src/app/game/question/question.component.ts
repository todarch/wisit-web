import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  Choice,
  GameService,
  QuestionAnswer,
  QuestionReactionStats,
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
import {ReportDialogComponent} from './report-dialog/report-dialog.component';
import {DatePipe} from '@angular/common';
import {NotificationService} from '../../shared/services/notification.service';
import {AuthService} from '../../shared/services/auth.service';
import {SigninDialogComponent} from '../../shared/signin-dialog/signin-dialog.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() questionAnswered = new EventEmitter();

  simpleQuestion = this.placeHolderQuestion();
  givenAnswer: Choice;
  correctAnswer: Choice;
  noMoreQuestions = false;
  answeredInSeconds: number;
  questionReactionStats = QuestionComponent.defaultStats();

  private userQuestionId;
  private answeringTimer;
  private questionType: QuestionType = QuestionType.CITIES_AS_CHOICES;

  @ViewChild('questionCard', { static: false, read: ElementRef }) card: ElementRef;

  private overlayRef: OverlayRef;

  private static defaultStats(): QuestionReactionStats {
    return {
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false
    };
  }

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
    this.fetchNewQuestion();
  }

  imageLoaded() {
    this.closeOverlay();
    this.startTimer();
  }

  private fetchNewQuestion() {
    if (this.authService.isGuest()) {
      this. newQuestion();
    } else {
      this.newUserQuestion();
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
            this.noMoreQuestions = true;
          }
          console.log(error);
          this.closeOverlay();
        }
      );
  }

  private newUserQuestion() {
    this.showOverlay();
    this.gameService.nextUserQuestion()
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

  private retrieveStats(questionId: string) {
    if (!questionId) {
      return;
    }
    this.gameService.stats(questionId).subscribe(
      (stats: QuestionReactionStats) => {
        this.questionReactionStats = stats;
      },
      (error: ErrorResponse) => {
        console.log(error);
      }
    );
  }

  onNewQuestion(question: SimpleQuestion) {
    this.simpleQuestion = question;
    this.givenAnswer = null;
    this.correctAnswer = null;
    this.retrieveStats(question.questionId);
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
      (answer: UserQuestionAnswer) => {
        this.correctAnswer = answer.questionAnswer.correctChoice;
        this.givenAnswer = answer.questionAnswer.givenChoice;
        this.questionAnswered.emit(answer.questionAnswer.scoreDelta);
        this.closeOverlay();
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.closeOverlay();
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
        this.questionAnswered.emit(answer.scoreDelta);
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
    this.fetchNewQuestion();
    this.questionReactionStats = QuestionComponent.defaultStats();
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

  openDialog() {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '50%',
      minWidth: '300px',
      data: {
        name: 'Report question',
        questionId: this.simpleQuestion.questionId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.onLeftBottomOk('The question is reported. Thank you.');
        this.fetchNewQuestion();
      }
    });
  }

  toHumanDate(createdAt: string) {
    return this.datePipe.transform(Date.parse(createdAt), 'mediumDate');
  }

  like(simpleQuestion: SimpleQuestion) {
    if (this.authService.isGuest()) {
      this.dialog.open(SigninDialogComponent, {
        hasBackdrop: true,
        data: {
          title: 'Like this question?',
          content: 'Sign in to make your opinion count.'
        }
      });
      return;
    }

    if (this.questionReactionStats.liked) {
      this.gameService.unlike(simpleQuestion.questionId)
        .subscribe(() => {
            this.questionReactionStats.liked = false;
            this.questionReactionStats.likes--;
            this.notificationService.onLeftBottom('Removed from liked pictures');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    } else {
      this.gameService.like(simpleQuestion.questionId)
        .subscribe(() => {
            if (this.questionReactionStats.disliked) {
              this.questionReactionStats.disliked = false;
              this.questionReactionStats.dislikes--;
            }
            this.questionReactionStats.liked = true;
            this.questionReactionStats.likes++;
            this.notificationService.onLeftBottom('Added to liked pictures');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    }
  }

  dislike(simpleQuestion: SimpleQuestion) {
    if (this.authService.isGuest()) {
      this.dialog.open(SigninDialogComponent, {
        hasBackdrop: true,
        data: {
          title: 'Don\'t like this question?',
          content: 'Sign in to make your opinion count.'
        }
      });
      return;
    }

    if (this.questionReactionStats.disliked) {
      this.gameService.undislike(simpleQuestion.questionId)
        .subscribe(() => {
            this.questionReactionStats.disliked = false;
            this.questionReactionStats.dislikes--;
            this.notificationService.onLeftBottom('Dislike removed');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    } else {
      this.gameService.dislike(simpleQuestion.questionId)
        .subscribe(() => {
            if (this.questionReactionStats.liked) {
              this.questionReactionStats.liked = false;
              this.questionReactionStats.likes--;
            }
            this.questionReactionStats.disliked = true;
            this.questionReactionStats.dislikes++;
            this.notificationService.onLeftBottom('You dislike this picture');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    }
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
