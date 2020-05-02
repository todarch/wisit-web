import {Component, OnInit} from '@angular/core';
import {GameService, QuestionAnswer, SimpleQuestion, UserScores} from '../services/game.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  question: SimpleQuestion;
  private answer: QuestionAnswer;
  userScores: UserScores;
  turnOff = true;

  guestMessage =
    ` Hello Foreigner! Please make yourself at home. Just a gentle reminder that
     your score is only informative, it will not be saved because you are not signed in.`;

  hiddenMessage =
    `This section will be revealed right after answering the question.`;

  constructor(private gameService: GameService,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.fetchUserScores();
  }

  private fetchUserScores() {
    if (this.authService.isGuest()) {
      this.userScores = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        scoreDelta: 0
      };
      return;
    }
    this.gameService.userScores()
      .subscribe((scores: UserScores) => {
          this.userScores = scores;
          this.userScores.scoreDelta = 0;
        },
        (error => {
          console.log(error);
        }));
  }

  onQuestionAnswered($event: any) {
    this.question = $event.question;
    this.answer = $event.answer;
    this.turnOff = false;
    const scoreDelta = this.answer.scoreDelta;
    this.userScores = {
      daily: this.userScores.daily + this.userScores.scoreDelta,
      weekly: this.userScores.weekly + this.userScores.scoreDelta,
      monthly: this.userScores.monthly + this.userScores.scoreDelta,
      scoreDelta
    };
  }

  onNewQuestionRequested() {
    this.turnOff = true;
  }
}
