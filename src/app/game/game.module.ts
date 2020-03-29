import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GameRoutingModule} from './game-routing.module';
import {QuestionComponent} from './question/question.component';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [QuestionComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    MaterialModule
  ]
})
export class GameModule { }
