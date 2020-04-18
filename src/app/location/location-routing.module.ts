import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CitiesComponent} from './cities/cities.component';


const routes: Routes = [
  { path: 'location/cities', component: CitiesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
