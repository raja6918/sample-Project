import API from './api';
import { AUTH_ENDPOINT, TOKEN_EXCHANGE_DATA } from './constants';
import { URL_BUILDER } from './utils';

export function getResourceToken(subjectToken) {
  const params = new URLSearchParams();
  TOKEN_EXCHANGE_DATA['audience'] = window.__KEYCLOAK_CLIENTS
    ? window.__KEYCLOAK_CLIENTS['resourceserver']
    : null;
  TOKEN_EXCHANGE_DATA['client_id'] = window.__KEYCLOAK_CLIENTS
    ? window.__KEYCLOAK_CLIENTS['client']
    : null;
  TOKEN_EXCHANGE_DATA['subject_token'] = subjectToken;
  const p = URL_BUILDER(params, TOKEN_EXCHANGE_DATA);
  const config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  if (TOKEN_EXCHANGE_DATA['audience'])
    return API.post(AUTH_ENDPOINT, p, config);
}
