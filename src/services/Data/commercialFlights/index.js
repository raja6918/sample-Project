import API from './../api';
import { FLIGHTS_ENDPOINT, TAGS_ENDPOINT } from './constants';
import {
  buildBulkRequestDataParam,
  getUserId,
  buildBulkDeleteRequestDataParam,
} from './../utils';

export function getCommercialFlights(scenarioId, requestPayload) {
  return API.post(
    `${FLIGHTS_ENDPOINT}/get?scenarioId=${scenarioId}`,
    requestPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function getTags(scenarioId) {
  return API.get(`${TAGS_ENDPOINT}?scenarioId=${scenarioId}`);
}

export function addCommercialFlight(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${FLIGHTS_ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editCommercialFlight(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.put(`${FLIGHTS_ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function getCommercialFlightCount(scenarioId) {
  const type = 'deadheadAggregate';
  const userId = getUserId();

  return API.get(
    `${FLIGHTS_ENDPOINT}/totalCount?scenarioId=${scenarioId}&type=${type}&userId=${userId}`,
    {
      data: {},
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
export function deleteCommercialFlight(flightId, scenarioId) {
  const data = buildBulkDeleteRequestDataParam(flightId);

  return API.delete(`${FLIGHTS_ENDPOINT}?scenarioId=${scenarioId}`, { data });
}
