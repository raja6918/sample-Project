import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getAircrafts(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getRestFacilities(scenarioId) {
  return API.get(`${ENDPOINT}/rest-facilities?scenarioId=${scenarioId}`);
}

export function addAircraft(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editAircraft(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function getAircraft(aircraftCode, scenarioId) {
  return API.get(`${ENDPOINT}/${aircraftCode}?scenarioId=${scenarioId}`);
}

export function deleteAircraft(aircraftCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(aircraftCode);
  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
