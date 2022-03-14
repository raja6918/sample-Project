import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getStation(statioCode, scenarioId) {
  return API.get(`${ENDPOINT}/${statioCode}/?scenarioId=${scenarioId}`);
}

export function getStations(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function deleteStation(stationCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(stationCode);

  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}

export function addStation(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editStation(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}
export function getStationsBasedOnFilter(scenarioId, filterArray) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, filterArray);
}
