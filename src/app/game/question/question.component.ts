import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  City,
  GameService,
  QuestionAnswer,
  QuestionReactionStats,
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

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() questionAnswered = new EventEmitter();

  simpleQuestion = this.placeHolderQuestion();
  givenAnswer: City;
  correctAnswer: City;
  noMoreQuestions = false;
  answeredInSeconds: number;
  questionReactionStats = QuestionComponent.defaultStats();

  private userQuestionId;
  private answeringTimer;

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

  onAnswer(givenAnswer: City) {
    if (this.authService.isGuest()) {
      this.answerQuestion(givenAnswer);
    } else {
      this.answerUserQuestion(givenAnswer);
    }
  }

  private answerUserQuestion(givenAnswer: City) {
    this.showOverlay();
    this.gameService.answerUserQuestion({
      userQuestionId: this.userQuestionId,
      cityId: givenAnswer.id,
      answeredInSeconds: this.answeredInSeconds
    }).subscribe(
      (answer: UserQuestionAnswer) => {
        this.correctAnswer = answer.questionAnswer.correctCity;
        this.givenAnswer = answer.questionAnswer.givenCity;
        this.questionAnswered.emit();
        this.closeOverlay();
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.closeOverlay();
      }
    );
  }

  private answerQuestion(givenAnswer: City) {
    this.showOverlay();
    this.gameService.answerQuestion({
      questionId: this.simpleQuestion.questionId,
      cityId: givenAnswer.id,
      answeredInSeconds: this.answeredInSeconds
    }).subscribe(
      (answer: QuestionAnswer) => {
        this.correctAnswer = answer.correctCity;
        this.givenAnswer = answer.givenCity;
        // this.questionAnswered.emit(); will not update score for guest
        this.closeOverlay();
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.closeOverlay();
      }
    );
  }

  getButtonColor(choice: City) {
    if (!this.answered()) {
      return '';
    }
    const loweredGivenAnswer = this.givenAnswer.name.toLowerCase();
    const loweredChoice = choice.name.toLowerCase();
    const loweredAnswer = this.correctAnswer.name.toLowerCase();
    if (loweredChoice === loweredAnswer) {
      return 'primary';
    }
    if (loweredGivenAnswer === loweredChoice) {
      return 'warn';
    } else {
      return '';
    }
  }

  getButtonIcon(choice: City) {
    if (!this.answered()) {
      return 'crop_square';
    }
    const loweredGivenAnswer = this.givenAnswer.name.toLowerCase();
    const loweredChoice = choice.name.toLowerCase();
    const loweredAnswer = this.correctAnswer.name.toLowerCase();
    if (loweredChoice === loweredAnswer) {
      return 'check';
    }
    if (loweredGivenAnswer === loweredChoice) {
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
    this.fetchNewQuestion();
    this.questionReactionStats = QuestionComponent.defaultStats();
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
        this.placeHolderCityOption(),
        this.placeHolderCityOption(),
        this.placeHolderCityOption(),
        this.placeHolderCityOption()
      ],
      createdAt: Date.now().toString(),
      answeredCount: 0
    };

  }

  private placeHolderCityOption(): City {
    return {
      id: 1,
      name: 'Loading'
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
    // TODO: show sign up pop up
    if (this.authService.isGuest()) { return; }

    if (this.questionReactionStats.liked) {
      //TODO:
      console.log('already liked, NOP, todo: unlike');
    }
    this.gameService.like(simpleQuestion.questionId)
      .subscribe(() => {
          if (this.questionReactionStats.disliked) {
            this.questionReactionStats.disliked = false;
            this.questionReactionStats.dislikes--;
          }
          this.questionReactionStats.liked = true;
          this.questionReactionStats.likes++;
          this.notificationService.onLeftBottomOk('Added to liked pictures');
        },
        (error: ErrorResponse) => {
          console.log(error);
        });
  }

  dislike(simpleQuestion: SimpleQuestion) {
    // TODO: show sign up pop up
    if (this.authService.isGuest()) { return; }

    if (this.questionReactionStats.disliked) {
      //TODO:
      console.log('already disliked, NOP, todo: remove dislike');
    }
    this.gameService.dislike(simpleQuestion.questionId)
      .subscribe(() => {
          if (this.questionReactionStats.liked) {
            this.questionReactionStats.liked = false;
            this.questionReactionStats.likes--;
          }
          this.questionReactionStats.disliked = true;
          this.questionReactionStats.dislikes++;
          this.notificationService.onLeftBottomOk('You dislike this picture');
        },
        (error: ErrorResponse) => {
          console.log(error);
        });
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
}
