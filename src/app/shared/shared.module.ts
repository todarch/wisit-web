import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {LoaderComponent} from './loader/loader.component';
import { DummyComponent } from './dummy/dummy.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { SigninDialogComponent } from './signin-dialog/signin-dialog.component';
import {RouterModule} from '@angular/router';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [LoaderComponent, DummyComponent, InfoBoxComponent, SigninDialogComponent, HeaderComponent],
    exports: [
        InfoBoxComponent,
        HeaderComponent
    ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ]
})
export class SharedModule { }
