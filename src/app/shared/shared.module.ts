import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {LoaderComponent} from './loader/loader.component';
import { DummyComponent } from './dummy/dummy.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { SigninDialogComponent } from './signin-dialog/signin-dialog.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [LoaderComponent, DummyComponent, InfoBoxComponent, SigninDialogComponent],
  exports: [
    InfoBoxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ]
})
export class SharedModule { }
