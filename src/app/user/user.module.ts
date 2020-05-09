import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UsernameComponent} from './username/username.component';
import {MaterialModule} from '../material/material.module';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { SavedListComponent } from './saved-list/saved-list.component';


@NgModule({
  declarations: [UsernameComponent, SavedListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }
