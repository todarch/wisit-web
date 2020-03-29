import {Component, OnInit} from '@angular/core';
import {GameService, OnePicFourChoiceQuestion} from '../services/game.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  simpleQuestion: OnePicFourChoiceQuestion;
  choices: string[];
  givenAnswer: string;
  showInfo: boolean;
  questionLoaded = false;

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
      error => {
        console.log(error);
        this.questionLoaded = true;
      }
    );
  }

  onNewQuestion(question: OnePicFourChoiceQuestion) {
    this.simpleQuestion = question;
    this.choices = this.simpleQuestion.choices;
    this.givenAnswer = '';
    this.showInfo = false;
  }

  onAnswer(givenAnswer: string) {
    this.givenAnswer = givenAnswer;
  }

  getButtonColor(choice: string) {
    if (!this.answered()) {
      return '';
    }
    const loweredGivenAnswer = this.givenAnswer.toLowerCase();
    const loweredChoice = choice.toLowerCase();
    const loweredAnswer = this.simpleQuestion.answer.toLowerCase();
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
      return '';
    }
    const loweredGivenAnswer = this.givenAnswer.toLowerCase();
    const loweredChoice = choice.toLowerCase();
    const loweredAnswer = this.simpleQuestion.answer.toLowerCase();
    if (loweredChoice === loweredAnswer) {
      return 'check';
    }
    if (loweredGivenAnswer === loweredChoice) {
      return 'close';
    } else {
      return '';
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
