import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GameRoutingModule} from './game-routing.module';
import {QuestionComponent} from './question/question.component';
import {MaterialModule} from '../material/material.module';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BoardComponent } from './board/board.component';
import { ReportDialogComponent } from './question/report-dialog/report-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PlaygroundComponent } from './playground/playground.component';
import { UserInfoComponent } from './user-info/user-info.component';
import {SharedModule} from '../shared/shared.module';
import { CommentsComponent } from './comments/comments.component';
import { QuestionInfoComponent } from './question-info/question-info.component';
import { PictureInfoComponent } from './picture-info/picture-info.component';


@NgModule({
  declarations: [QuestionComponent, LeaderboardComponent, BoardComponent, ReportDialogComponent, PlaygroundComponent, UserInfoComponent, CommentsComponent, QuestionInfoComponent, PictureInfoComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class GameModule { }
