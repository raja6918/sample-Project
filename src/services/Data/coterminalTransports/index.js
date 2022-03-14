import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getCoterminalTransports(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getCoterminalTransportById(itemId, scenarioId) {
  return API.get(`${ENDPOINT}/${itemId}?scenarioId=${scenarioId}`);
}

export function addCoterminalTransport(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editCoterminalTransport(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deleteCoterminalTransport(itemId, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(itemId);
  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
