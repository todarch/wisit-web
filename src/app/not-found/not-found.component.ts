import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  picUrl = '/assets/img/not-found.png';
  choices = [ '401', '404', '200', '201'];
  givenAnswer = '200';
  correctAnswer = '404';

  getButtonIcon(choice: string) {
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
}
