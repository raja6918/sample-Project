import API from './api';
import { buildBulkRequestDataParam } from './../utils';
import {
  BIN_ENDPOINT,
  SCENARIO_BIN_ENDPOINT,
  FILE_ENDPOINT,
} from './constants';

export function getAllBins(data) {
  const { startDate, endDate } = data;
  const params = `startDate=${startDate}&endDate=${endDate}`;
  return API.get(`${BIN_ENDPOINT}?${params}`);
}

export function getScenarioBins(data) {
  const { startDate, endDate, scenarioId, userId } = data;
  const params = `startDate=${startDate}&endDate=${endDate}&scenarioId=${scenarioId}&userId=${userId}`;
  return API.get(`${BIN_ENDPOINT}?${params}`);
}

export function createBin(data, userId) {
  const binData = buildBulkRequestDataParam(data);

  return API.post(`${BIN_ENDPOINT}?userId=${userId}`, binData);
}

export function connectBin(data, userId) {
  const binData = buildBulkRequestDataParam(data);

  return API.post(`${SCENARIO_BIN_ENDPOINT}?userId=${userId}`, binData);
}

export function getOtherVersions(dataType, binId) {
  const params = `binId=${binId}&fileType=${dataType}`;
  return API.get(`${FILE_ENDPOINT}?${params}`);
}
