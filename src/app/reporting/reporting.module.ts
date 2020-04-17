import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportedQuestionsComponent } from './reported-questions/reported-questions.component';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [ReportedQuestionsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReportingRoutingModule
  ]
})
export class ReportingModule { }
