// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Add here your keycloak setup infos
import {KeycloakConfig} from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:7007/auth',
  realm: 'todarch',
  clientId: 'wisit-app'
};

export const environment = {
  production: false,
  apiUrl: 'http://localhost:7010',
  // apiUrl: 'https://wisit-be.todarch.com',
  keycloakConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
