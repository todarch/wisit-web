import {Component, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';

export interface LeaderBoardItem {
  rank: number;
  username: string;
  score: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  getDailyLeaderboard$() {
    return this.gameService.dailyLeaderboard();
  }

  getWeeklyLeaderboard$() {
    return this.gameService.weeklyLeaderboard();
  }

  getMonthlyLeaderboard$() {
    return this.gameService.monthlyLeaderboard();
  }
}
