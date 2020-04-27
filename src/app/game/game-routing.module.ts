import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {PlaygroundComponent} from './playground/playground.component';


const routes: Routes = [
  { path: 'game', component: PlaygroundComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
