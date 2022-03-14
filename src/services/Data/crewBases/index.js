import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getCrewBase(baseCode, scenarioId) {
  return API.get(`${ENDPOINT}/${baseCode}?scenarioId=${scenarioId}`);
}

export function getCrewBases(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function addCrewBases(crewBase, scenarioId) {
  const data = buildBulkRequestDataParam(crewBase);

  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editCrewBases(crewBase, scenarioId) {
  const data = buildBulkRequestDataParam(crewBase);

  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deleteCrewBases(crewBaseCode, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(crewBaseCode);

  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
