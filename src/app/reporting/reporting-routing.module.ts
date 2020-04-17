import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportedQuestionsComponent} from './reported-questions/reported-questions.component';


const routes: Routes = [
  { path: 'reportings/reported-questions', component: ReportedQuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
