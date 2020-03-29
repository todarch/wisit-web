import { Component, OnInit } from '@angular/core';

interface OnePicFourChoiceQuestion {
  picUrl: string;
  choices: string[];
  answer: string;
  info: string;
}

const questions: OnePicFourChoiceQuestion[] = [
  {
    picUrl: 'https://farm8.staticflickr.com/7385/8731881776_92d7bf6603_b.jpg',
    choices: ['Berlin', 'Istanbul', 'Stockholm', 'Brussels'],
    answer: 'Stockholm',
    info: 'Some info about stockholm'
  },
  {
    picUrl: 'https://farm9.staticflickr.com/8667/15491990730_83ce51863a_b.jpg',
    choices: ['Berlin', 'Istanbul', 'Stockholm', 'Brussels'],
    answer: 'Istanbul',
    info: 'Some info about istanbul'
  },
  {
    picUrl: 'https://farm4.staticflickr.com/3537/3826608877_9a00664fd0_b.jpg',
    choices: ['Gdansk', 'Istanbul', 'Stockholm', 'Brussels'],
    answer: 'Gdansk',
    info: 'Some info about Gdansk'
  },
];

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

  constructor() { }

  ngOnInit(): void {
    this.newQuestion();
  }

  private newQuestion() {
    this.simpleQuestion = questions[this.random()];
    this.choices = this.simpleQuestion.choices;
    this.givenAnswer = '';
    this.showInfo = false;
  }

  private random() {
    return Math.floor(Math.random() * questions.length);
  }

  onAnswer(givenAnswer: string) {
    console.log('given answer', givenAnswer);
    this.givenAnswer = givenAnswer;
  }

  getButtonColor(choice: string) {
    if (!this.answered()) {
      return '';
    }
    console.log('getting color for:', choice);
    const loweredGivenAnswer = this.givenAnswer.toLowerCase();
    const loweredChoice = choice.toLowerCase();
    const loweredAnswer = this.simpleQuestion.answer.toLowerCase();
    console.log(`given='${loweredGivenAnswer}', choice='${loweredChoice}', answer='${loweredAnswer}'`);
    if (loweredChoice === loweredAnswer) {
      console.log('returning primary');
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
    console.log('getting color for:', choice);
    const loweredGivenAnswer = this.givenAnswer.toLowerCase();
    const loweredChoice = choice.toLowerCase();
    const loweredAnswer = this.simpleQuestion.answer.toLowerCase();
    console.log(`given='${loweredGivenAnswer}', choice='${loweredChoice}', answer='${loweredAnswer}'`);
    if (loweredChoice === loweredAnswer) {
      console.log('returning primary');
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
