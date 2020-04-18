import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { CitiesComponent } from './cities/cities.component';
import {MaterialModule} from '../material/material.module';
import { AddCityDialogComponent } from './cities/add-city-dialog/add-city-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ExploredPicDialogComponent } from './cities/explored-pic-dialog/explored-pic-dialog.component';


@NgModule({
  declarations: [CitiesComponent, AddCityDialogComponent, ExploredPicDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LocationRoutingModule
  ]
})
export class LocationModule { }
