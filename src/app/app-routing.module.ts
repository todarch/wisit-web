import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {WelcomeComponent} from './welcome/welcome.component';


const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
