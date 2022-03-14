import Keycloak from 'keycloak-js';

// this config needs to updated to meet multitenancy
const keycloak = new Keycloak({
  url: window.__APP_CONFIG
    ? window.__APP_CONFIG.KEYCLOAK_API + '/auth/'
    : 'http://35.225.8.244:8080/auth',
  realm: 'sierra',
  clientId: 'sierra-fe',
});
export default keycloak;
