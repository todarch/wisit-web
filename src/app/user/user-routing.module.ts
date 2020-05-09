import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsernameComponent} from './username/username.component';
import {SavedListComponent} from './saved-list/saved-list.component';
import {AppAuthGuard} from '../app.authguard';


const routes: Routes = [
  // { path: 'users/pick-a-username', component: UsernameComponent },
  { path: 'saved-list', component: SavedListComponent, canActivate: [AppAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
