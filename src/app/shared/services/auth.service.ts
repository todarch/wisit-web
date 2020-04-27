import { Injectable } from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userDetails: KeycloakProfile;
  private guestUser;

  constructor(private keycloakService: KeycloakService) { }

  async isLoggedIn() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
      this.guestUser = false;
    } else {
      this.guestUser = true;
    }
  }

  username() {
    return this.userDetails ? this.userDetails.username : 'Foreigner';
  }

  async doLogout() {
    await this.keycloakService.logout();
    this.guestUser = true;
  }

  isGuest() {
    return this.guestUser;
  }
}
