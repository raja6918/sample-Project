import API from './../api';
import {
  buildBulkRequestDataParam,
  buildBulkDeleteRequestDataParam,
} from './../utils';
import { ENDPOINT } from './constants';

export function getCrewGroups(scenarioId, requestPayload = null) {
  return API.post(`${ENDPOINT}/get?scenarioId=${scenarioId}`, requestPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getCrewGroup(itemId, scenarioId) {
  return API.get(`${ENDPOINT}/${itemId}?scenarioId=${scenarioId}`);
}

export function addCrewGroup(crewGroup, scenarioId) {
  const data = buildBulkRequestDataParam(crewGroup);
  return API.post(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editCrewGroup(crewGroup, scenarioId) {
  const data = buildBulkRequestDataParam(crewGroup);
  return API.put(`${ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deleteCrewGroup(crewGroupId, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(crewGroupId);

  return API.delete(`${ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
