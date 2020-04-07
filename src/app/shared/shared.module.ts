import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {LoaderComponent} from './loader/loader.component';


@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
