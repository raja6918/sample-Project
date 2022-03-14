import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getAccommodation(accommodationId, scenarioId) {
  return API.get(`${ENDPOINT}/${accommodationId}?scenarioId=${scenarioId}`);
}

export function getAccommodations(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function addAccommodation(accommodation, scenarioId) {
  const data = buildBulkRequestDataParam(accommodation);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editAccommodation(accommodation, scenarioId) {
  const data = buildBulkRequestDataParam(accommodation);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deleteAccommodation(accommodationId, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(accommodationId);
  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
