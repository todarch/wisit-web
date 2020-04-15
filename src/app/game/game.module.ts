import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GameRoutingModule} from './game-routing.module';
import {QuestionComponent} from './question/question.component';
import {MaterialModule} from '../material/material.module';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BoardComponent } from './board/board.component';
import { ReportDialogComponent } from './question/report-dialog/report-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [QuestionComponent, LeaderboardComponent, BoardComponent, ReportDialogComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class GameModule { }
