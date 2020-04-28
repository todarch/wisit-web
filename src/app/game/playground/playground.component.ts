import {Component, OnInit} from '@angular/core';
import {GameService, UserScores} from '../services/game.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  userScores: UserScores;

  guestMessage =
    ` Hello visitor! Please make yourself at home. Just a gentle reminder that
     we do not know you yet so the functionality is limited.`;

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
        },
        (error => {
          console.log(error);
        }));
  }

  onQuestionAnswered($event: any) {
    const scoreDelta = $event;
    this.userScores = {
      daily: this.userScores.daily + this.userScores.scoreDelta,
      weekly: this.userScores.weekly + this.userScores.scoreDelta,
      monthly: this.userScores.monthly + this.userScores.scoreDelta,
      scoreDelta
    };
  }
}
