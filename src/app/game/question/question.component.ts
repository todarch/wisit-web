import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GameService, OnePicFourChoiceQuestion, UserQuestionAnswer} from '../services/game.service';
import {ErrorResponse} from '../../shared/error-response';
import {OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../shared/loader/loader.component';
import {DynamicOverlayService} from '../../shared/services/dynamic-overlay.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, AfterViewInit {
  simpleQuestion: OnePicFourChoiceQuestion = {
    userQuestionId: '',
    picUrl: '',
    choiceCityIds: [],
    choices: [],
    answer: '',
    info: '',
  };
  choices: string[];
  givenAnswer: string;
  correctAnswer: string;
  showInfo: boolean;
  noMoreQuestions = false;

  @ViewChild('questionCard', { static: false, read: ElementRef }) card: ElementRef;

  private overlayRef: OverlayRef;

  constructor(private gameService: GameService,
              private dynamicOverlayService: DynamicOverlayService) { }

  ngOnInit(): void {
    console.log('on after on init', this.card);
  }

  ngAfterViewInit() {
    console.log('on after view init', this.card);
    this.newQuestion();
  }

  private newQuestion() {
    this.showOverlay();
    this.gameService.nextQuestion().subscribe(
      (question: OnePicFourChoiceQuestion) => {
        this.onNewQuestion(question);
        this.closeOverlay();
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
    this.choices = this.simpleQuestion.choices;
    this.givenAnswer = '';
    this.correctAnswer = '';
    this.showInfo = false;
  }

  onAnswer(givenAnswer: string) {
    this.showOverlay();
    this.gameService.answerQuestion({
      userQuestionId: this.simpleQuestion.userQuestionId,
      cityId: this.simpleQuestion.choiceCityIds[this.simpleQuestion.choices.indexOf(givenAnswer)]
    }).subscribe(
      (answer: UserQuestionAnswer) => {
        this.correctAnswer = answer.correctCity.name;
        this.givenAnswer = givenAnswer;
        this.closeOverlay();
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.closeOverlay();
      }
    );
  }

  getButtonColor(choice: string) {
    if (!this.answered()) {
      return '';
    }
    const loweredGivenAnswer = this.givenAnswer.toLowerCase();
    const loweredChoice = choice.toLowerCase();
    const loweredAnswer = this.correctAnswer.toLowerCase();
    if (loweredChoice === loweredAnswer) {
      return 'primary';
    }
    if (loweredGivenAnswer === loweredChoice) {
      return 'warn';
    } else {
      return '';
    }
  }

  getButtonIcon(choice: string) {
    if (!this.answered()) {
      return 'crop_square';
    }
    const loweredGivenAnswer = this.givenAnswer.toLowerCase();
    const loweredChoice = choice.toLowerCase();
    const loweredAnswer = this.correctAnswer.toLowerCase();
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
}
