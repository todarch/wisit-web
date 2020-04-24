import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuestionComponent} from './question/question.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {AppAuthGuard} from '../app.authguard';


const routes: Routes = [
  { path: 'game', component: QuestionComponent, canActivate: [AppAuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
