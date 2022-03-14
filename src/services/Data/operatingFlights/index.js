import API from './../api';
import { buildBulkRequestDataParam, getUserId } from './../utils';
import {
  FLIGHTS_ENDPOINT,
  TAGS_ENDPOINT,
  AIRLINES_ENDPOINT,
  SERVICES_ENDPOINT,
} from './constants';

export function getOperatingFlights(scenarioId, requestPayload) {
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

export function addOperatingFlight(dataToSave, scenarioId) {
  const data = buildBulkRequestDataParam(dataToSave);

  return API.post(`${FLIGHTS_ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function editOperatingFlight(dataToUpdate, scenarioId) {
  const data = buildBulkRequestDataParam(dataToUpdate);

  return API.put(`${FLIGHTS_ENDPOINT}?scenarioId=${scenarioId}`, data);
}

export function deleteOperatingFlight(flightAggregates, scenarioId) {
  const data = buildBulkRequestDataParam(flightAggregates);

  return API.delete(`${FLIGHTS_ENDPOINT}?scenarioId=${scenarioId}`, { data });
}

export function getOperatingFlightCount(scenarioId) {
  const type = 'flight';
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

export function getTags(scenarioId) {
  return API.get(`${TAGS_ENDPOINT}?scenarioId=${scenarioId}`);
}

export function getServiceTypes(scenarioId) {
  return API.get(`${SERVICES_ENDPOINT}?scenarioId=${scenarioId}`);
}

export function getAirlineIdentifiers(scenarioId) {
  return API.get(`${AIRLINES_ENDPOINT}?scenarioId=${scenarioId}`);
}

export function getOperatingFlightsBasedOnFilter(scenarioId, filterArray) {
  return API.post(
    `${FLIGHTS_ENDPOINT}/get?scenarioId=${scenarioId}`,
    filterArray
  );
}
