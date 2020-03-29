import { Component, OnInit } from '@angular/core';

interface OnePicFourChoiceQuestion {
  picUrl: string;
  choices: string[];
}

const questions: OnePicFourChoiceQuestion[] = [
  {
    picUrl: 'https://farm8.staticflickr.com/7385/8731881776_92d7bf6603_b.jpg',
    choices: ['Berlin', 'Istanbul', 'Stockholm', 'Brussels']
  },
  {
    picUrl: 'https://farm9.staticflickr.com/8667/15491990730_83ce51863a_b.jpg',
    choices: ['Berlin', 'Istanbul', 'Stockholm', 'Brussels']
  },
  {
    picUrl: 'https://farm4.staticflickr.com/3537/3826608877_9a00664fd0_b.jpg',
    choices: ['Gdansk', 'Istanbul', 'Stockholm', 'Brussels']
  },
];

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  simpleQuestion: OnePicFourChoiceQuestion;

  constructor() { }

  ngOnInit(): void {
    this.simpleQuestion = questions[this.random()];
  }

  private random() {
    return Math.floor(Math.random() * questions.length);
  }

}
