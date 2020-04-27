import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {LoaderComponent} from './loader/loader.component';
import { DummyComponent } from './dummy/dummy.component';
import { InfoBoxComponent } from './info-box/info-box.component';


@NgModule({
  declarations: [LoaderComponent, DummyComponent, InfoBoxComponent],
  exports: [
    InfoBoxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
