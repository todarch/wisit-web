import { Component, OnInit } from '@angular/core';
import {OnePicFourChoiceQuestion} from '../game/services/game.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  simpleQuestion: OnePicFourChoiceQuestion = {
    userQuestionId: '',
    picUrl: '/assets/img/not-found.png',
    choiceCityIds: [],
    choices: [ '401', '404', '200', '201'],
    answer: '',
    info: '',
  };
  givenAnswer = '200';
  correctAnswer = '404';

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

  constructor() { }

  ngOnInit(): void {
  }

  public answered() {
    if (this.givenAnswer) {
      return true;
    } else {
      return false;
    }
  }

  onAnswer(choice: string) {

  }

  next() {

  }
}
