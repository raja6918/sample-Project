import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getModels(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function addModel(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editModel(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function getModel(modelCode, scenarioId) {
  return API.get(`${ENDPOINT}/${modelCode}?scenarioId=${scenarioId}`);
}

export function deleteModel(modelCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(modelCode);
  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
