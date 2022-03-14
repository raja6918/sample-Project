import API from './../api';

export const ENDPOINT = '/data';

export function getAccommodationBillingPolicies(scenarioId) {
  const API_URL = `${ENDPOINT}/accommodation-billing-policies`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getTransportBillingPolicies(scenarioId) {
  const API_URL = `${ENDPOINT}/transport-billing-policies`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getAccommodationTypes(scenarioId) {
  const API_URL = `${ENDPOINT}/accommodation-types`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getTransportTypes(scenarioId) {
  const API_URL = `${ENDPOINT}/transport-types`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getCreditPolicies(scenarioId) {
  const API_URL = `${ENDPOINT}/credit-policies`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getPositionTypes(scenarioId) {
  const API_URL = `${ENDPOINT}/position-types`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getRestFacilities(scenarioId) {
  const API_URL = `${ENDPOINT}/rest-facilities`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}

export function getRuleSets(scenarioId) {
  const API_URL = `${ENDPOINT}/rulesets`;
  return API.get(`${API_URL}?scenarioId=${scenarioId}`);
}
