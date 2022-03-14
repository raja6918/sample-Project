import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getCurrencies(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function addCurrency(currency, scenarioId) {
  const data = buildBulkRequestDataParam(currency);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editCurrency(currency, scenarioId) {
  const data = buildBulkRequestDataParam(currency);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function getCurrency(currency, scenarioId) {
  return API.get(`${ENDPOINT}/${currency}?scenarioId=${scenarioId}`);
}

export function deleteCurrency(currency, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(currency);
  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
