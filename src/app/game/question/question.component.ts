import {Component, OnInit} from '@angular/core';
import {GameService, OnePicFourChoiceQuestion, UserQuestionAnswer} from '../services/game.service';
import {ErrorResponse} from '../../shared/error-response';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  simpleQuestion: OnePicFourChoiceQuestion;
  choices: string[];
  givenAnswer: string;
  correctAnswer: string;
  showInfo: boolean;
  questionLoaded = false;
  answerQuestionLoading = false;
  noMoreQuestions = false;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.newQuestion();
  }

  private newQuestion() {
    this.gameService.nextQuestion().subscribe(
      (question: OnePicFourChoiceQuestion) => {
        this.onNewQuestion(question);
        this.questionLoaded = true;
      },
      (error: ErrorResponse) => {
        if (error.httpStatusCode === 404) {
          this.noMoreQuestions = true;
        }
        console.log(error);
        this.questionLoaded = true;
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
    this.answerQuestionLoading = true;
    this.gameService.answerQuestion({
      userQuestionId: this.simpleQuestion.userQuestionId,
      cityId: this.simpleQuestion.choiceCityIds[this.simpleQuestion.choices.indexOf(givenAnswer)]
    }).subscribe(
      (answer: UserQuestionAnswer) => {
        this.correctAnswer = answer.correctCity.name;
        this.givenAnswer = givenAnswer;
        this.answerQuestionLoading = false;
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.answerQuestionLoading = false;
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
}
