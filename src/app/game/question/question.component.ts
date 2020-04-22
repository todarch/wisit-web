import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {City, GameService, OnePicFourChoiceQuestion, UserQuestionAnswer} from '../services/game.service';
import {ErrorResponse} from '../../shared/error-response';
import {OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../shared/loader/loader.component';
import {DynamicOverlayService} from '../../shared/services/dynamic-overlay.service';
import {UserProfile, UserService} from '../../user/services/user.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ReportDialogComponent, ReportingReason} from './report-dialog/report-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy, AfterViewInit {
  simpleQuestion = this.placeHolderQuestion();
  givenAnswer: City;
  correctAnswer: City;
  showInfo: boolean;
  noMoreQuestions = false;
  answeredInSeconds: number;

  private answeringTimer;

  @ViewChild('questionCard', { static: false, read: ElementRef }) card: ElementRef;

  private overlayRef: OverlayRef;

  constructor(private gameService: GameService,
              private userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private datePipe: DatePipe,
              private dynamicOverlayService: DynamicOverlayService) { }

  ngOnInit(): void {
    // console.log('on after on init', this.card);
  }

  ngOnDestroy() {
    if (this.answeringTimer) {
      clearInterval(this.answeringTimer);
    }
  }

  ngAfterViewInit() {
    // console.log('on after view init', this.card);
    this.checkUsername();
    this.newQuestion();
  }

  imageLoaded() {
    this.closeOverlay();
    this.startTimer();
  }

  private newQuestion() {
    this.showOverlay();
    this.gameService.nextQuestion().subscribe(
      (question: OnePicFourChoiceQuestion) => {
        this.onNewQuestion(question);
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

  onNewQuestion(question: OnePicFourChoiceQuestion) {
    this.simpleQuestion = question;
    this.givenAnswer = null;
    this.correctAnswer = null;
    this.showInfo = false;
  }

  onAnswer(givenAnswer: City) {
    this.showOverlay();
    this.gameService.answerQuestion({
      userQuestionId: this.simpleQuestion.userQuestionId,
      cityId: givenAnswer.id,
      answeredInSeconds: this.answeredInSeconds
    }).subscribe(
      (answer: UserQuestionAnswer) => {
        this.correctAnswer = answer.correctCity;
        this.givenAnswer = givenAnswer;
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

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  next() {
    this.newQuestion();
  }

  showOverlay() {
      this.overlayRef = this.dynamicOverlayService.createWithDefaultConfig(this.card.nativeElement);
      this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  closeOverlay() {
    this.overlayRef.detach();
  }

  private checkUsername() {
    this.userService.profile()
      .subscribe((userProfile: UserProfile) => {
        },
        (error => {
          this.router.navigate(['users/pick-a-username']);
        }));
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
        this.snackBar.open('The question is reported. Thank you.', 'OK', { horizontalPosition: 'left', duration: 5000 });
        this.newQuestion();
      }
    });
  }

  toHumanDate(createdAt: string) {
    return this.datePipe.transform(Date.parse(createdAt), 'mediumDate');
  }

  like(simpleQuestion: OnePicFourChoiceQuestion) {

  }

  dislike(simpleQuestion: OnePicFourChoiceQuestion) {

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
