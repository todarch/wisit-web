import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {LoaderComponent} from './loader/loader.component';
import { DummyComponent } from './dummy/dummy.component';


@NgModule({
  declarations: [LoaderComponent, DummyComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
