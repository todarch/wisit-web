import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsernameComponent} from './username/username.component';


const routes: Routes = [
  // { path: 'users/pick-a-username', component: UsernameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
