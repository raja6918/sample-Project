import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getRegions(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function addRegion(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editRegion(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deleteRegion(regionCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(regionCode);

  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}

export function getRegion(regionCode, scenarioId) {
  return API.get(`${ENDPOINT}/${regionCode}?scenarioId=${scenarioId}`);
}
