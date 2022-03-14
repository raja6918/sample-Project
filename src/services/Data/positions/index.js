import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getPositions(scenarioId) {
  return API.get(`${ENDPOINT}?scenarioId=${scenarioId}`);
}

export function getCategories(scenarioId) {
  const ENDPOINT = '/data';
  return API.get(`${ENDPOINT}/positions-categorized?scenarioId=${scenarioId}`);
}

export function addPosition(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editPosition(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deletePosition(positionCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(positionCode);

  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}

export function getPosition(positionCode, scenarioId) {
  return API.get(`${ENDPOINT}/${positionCode}?scenarioId=${scenarioId}`);
}
