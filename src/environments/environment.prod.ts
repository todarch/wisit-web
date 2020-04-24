// Add here your keycloak setup infos
import {KeycloakConfig} from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'https://id.todarch.com/auth',
  realm: 'todarch',
  clientId: 'wisit-app'
};

export const environment = {
  production: true,
  apiUrl: 'https://wisit-be.todarch.com',
  keycloakConfig
};
