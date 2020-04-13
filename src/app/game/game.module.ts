import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GameRoutingModule} from './game-routing.module';
import {QuestionComponent} from './question/question.component';
import {MaterialModule} from '../material/material.module';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BoardComponent } from './board/board.component';


@NgModule({
  declarations: [QuestionComponent, LeaderboardComponent, BoardComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    MaterialModule
  ]
})
export class GameModule { }
