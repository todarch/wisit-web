import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavComponent} from './nav/nav.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {MaterialModule} from './material/material.module';
import {GameModule} from './game/game.module';
import {FooterComponent} from './footer/footer.component';
import {HttpClientModule} from '@angular/common/http';
import {PictureModule} from './picture/picture.module';
import {FormsModule} from '@angular/forms';
import {LoaderComponent} from './shared/loader/loader.component';
import {UserModule} from './user/user.module';
import {ReportingModule} from './reporting/reporting.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NotFoundComponent,
    WelcomeComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    GameModule,
    BrowserAnimationsModule,
    MaterialModule,
    PictureModule,
    UserModule,
    ReportingModule,
    AppRoutingModule // keep at the bottom
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoaderComponent]
})
export class AppModule { }
