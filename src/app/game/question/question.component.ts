import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {City, GameService, OnePicFourChoiceQuestion, QuestionReactionStats, UserQuestionAnswer} from '../services/game.service';
import {ErrorResponse} from '../../shared/error-response';
import {OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../shared/loader/loader.component';
import {DynamicOverlayService} from '../../shared/services/dynamic-overlay.service';
import {UserService} from '../../user/services/user.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ReportDialogComponent} from './report-dialog/report-dialog.component';
import {DatePipe} from '@angular/common';
import {NotificationService} from '../../shared/services/notification.service';

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
              private userService: UserService,
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
    this.newQuestion();
  }

  imageLoaded() {
    this.closeOverlay();
    this.startTimer();
  }

  private newQuestion() {
    this.showOverlay();
    this.gameService.nextUserQuestion().subscribe(
      (question: OnePicFourChoiceQuestion) => {
        this.onNewQuestion(question);
        this.retrieveStats(question);
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

  private retrieveStats(question: OnePicFourChoiceQuestion) {
    if (!question.questionId) {
      return;
    }
    this.gameService.stats(question.questionId).subscribe(
      (stats: QuestionReactionStats) => {
        this.questionReactionStats = stats;
      },
      (error: ErrorResponse) => {
        console.log(error);
      }
    );
  }

  onNewQuestion(question: OnePicFourChoiceQuestion) {
    this.simpleQuestion = question;
    this.givenAnswer = null;
    this.correctAnswer = null;
  }

  onAnswer(givenAnswer: City) {
    this.showOverlay();
    this.gameService.answerUserQuestion({
      userQuestionId: this.simpleQuestion.userQuestionId,
      cityId: givenAnswer.id,
      answeredInSeconds: this.answeredInSeconds
    }).subscribe(
      (answer: UserQuestionAnswer) => {
        this.correctAnswer = answer.correctCity;
        this.givenAnswer = givenAnswer;
        this.questionAnswered.emit();
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
    this.newQuestion();
    this.questionReactionStats = QuestionComponent.defaultStats();
  }

  showOverlay() {
      this.overlayRef = this.dynamicOverlayService.createWithDefaultConfig(this.card.nativeElement);
      this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  closeOverlay() {
    this.overlayRef.detach();
  }

  private placeHolderQuestion(): OnePicFourChoiceQuestion {
    return  {
      userQuestionId: '',
      questionId: '',
      picUrl: '/assets/img/loading-placeholder.png',
      choices: [
        this.placeHolderCityOption(),
        this.placeHolderCityOption(),
        this.placeHolderCityOption(),
        this.placeHolderCityOption()
      ],
      info: '',
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
        this.newQuestion();
      }
    });
  }

  toHumanDate(createdAt: string) {
    return this.datePipe.transform(Date.parse(createdAt), 'mediumDate');
  }

  like(simpleQuestion: OnePicFourChoiceQuestion) {
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

  dislike(simpleQuestion: OnePicFourChoiceQuestion) {
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
