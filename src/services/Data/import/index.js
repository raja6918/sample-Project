import API from './api';
import {
  IMPORT_ENDPOINT,
  CONVERTION_SUMMARY_ENDPOINT,
  DATA_SUMMARY_ENDPOINT,
} from './constants';

import { buildBulkRequestDataParam } from './../utils';

export function getDynamicRenderRules() {
  return API.get(`${IMPORT_ENDPOINT}/data-types`);
}

export function uploadFiles(data) {
  const { files, filesMetadata, scenarioId, userId } = data;
  const postData = buildBulkRequestDataParam(filesMetadata);

  const formData = new FormData();
  formData.append('filesMetadata', JSON.stringify(postData));
  files.forEach(f => {
    formData.append('files', f, f.name);
  });

  const params = `scenarioId=${scenarioId}&userId=${userId}`;

  return API.post(`${IMPORT_ENDPOINT}?${params}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getImportProcess(data) {
  const { scenarioId, userId, state } = data;
  const params = `scenarioId=${scenarioId}&state=${state}&userId=${userId}`;

  return API.get(`${IMPORT_ENDPOINT}?${params}`);
}

export function getImportById(data) {
  const { importProcessId, userId } = data;
  const params = `${importProcessId}?userId=${userId}`;

  return API.get(`${IMPORT_ENDPOINT}/${params}`);
}

export function getConversionSummary(data) {
  const { importProcessId, userId } = data;
  const params = `importProcessId=${importProcessId}&userId=${userId}`;

  return API.get(`${CONVERTION_SUMMARY_ENDPOINT}?${params}`);
}

export function getConversionError(data) {
  const { importProcessId, userId } = data;
  const params = `importProcessId=${importProcessId}&userId=${userId}&severity=ERROR`;

  return API.get(`${CONVERTION_SUMMARY_ENDPOINT}?${params}`);
}

export function getErrorsSummary(scenarioId, userId) {
  const params = `scenarioId=${scenarioId}&userId=${userId}`;

  return API.get(`${DATA_SUMMARY_ENDPOINT}?${params}`);
}

export function hideError(errorId) {
  return API.put(`${DATA_SUMMARY_ENDPOINT}/${errorId}`);
}

export function updateFromBin(scenarioBinsFiles, scenarioId, userId) {
  const putData = buildBulkRequestDataParam(scenarioBinsFiles);
  const params = `scenarioId=${scenarioId}&userId=${userId}`;

  return API.put(`${IMPORT_ENDPOINT}/update-bin-files?${params}`, putData);
}

export function updateImportStatus(action, importProcessId, userId) {
  const params = `importProcessId=${importProcessId}&userId=${userId}&action=${action}`;

  return API.put(`${IMPORT_ENDPOINT}?${params}`);
}
