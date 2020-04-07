import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PictureRoutingModule } from './picture-routing.module';
import { PictureFormComponent } from './picture-form/picture-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [PictureFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    PictureRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class PictureModule { }
