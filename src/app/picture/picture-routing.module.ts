import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PictureFormComponent} from './picture-form/picture-form.component';


const routes: Routes = [
  { path: 'pictures/new', component: PictureFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PictureRoutingModule { }
