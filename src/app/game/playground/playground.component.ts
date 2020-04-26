import {Component, OnInit} from '@angular/core';
import {GameService, UserScores} from '../services/game.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  userScores: UserScores;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.fetchUserScores();
  }

  private fetchUserScores() {
    this.gameService.userScores()
      .subscribe((scores: UserScores) => {
          this.userScores = scores;
        },
        (error => {
          console.log(error);
        }));
  }

  onQuestionAnswered($event: any) {
    this.fetchUserScores();
  }
}
