import {BrowserModule} from '@angular/platform-browser';
import {DoBootstrap, NgModule} from '@angular/core';

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
import {LocationModule} from './location/location.module';
import {DatePipe} from '@angular/common';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {environment} from '../environments/environment';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NotFoundComponent,
    WelcomeComponent,
    FooterComponent,
  ],
  imports: [
    KeycloakAngularModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    GameModule,
    BrowserAnimationsModule,
    MaterialModule,
    PictureModule,
    UserModule,
    ReportingModule,
    LocationModule,
    AppRoutingModule // keep at the bottom
  ],
  providers: [
    DatePipe,
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
  ],
  entryComponents: [AppComponent, LoaderComponent]
})
export class AppModule implements DoBootstrap {
  async ngDoBootstrap(app) {
    const { keycloakConfig } = environment;

    try {
      await keycloakService.init({
        config: keycloakConfig,
        initOptions: {
          onLoad: 'check-sso', // do not require logged in, but check if logged in
          checkLoginIframe: true
        }
      });
      app.bootstrap(AppComponent);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }
}
