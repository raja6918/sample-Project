import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getCountries(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function addCountry(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editCountry(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function getCountry(countryCode, scenarioId) {
  return API.get(`${ENDPOINT}/${countryCode}?scenarioId=${scenarioId}`);
}

export function deleteCountry(countryCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(countryCode);
  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
