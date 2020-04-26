import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {AppAuthGuard} from '../app.authguard';
import {PlaygroundComponent} from './playground/playground.component';


const routes: Routes = [
  { path: 'game', component: PlaygroundComponent, canActivate: [AppAuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
