import API from './api';
import {
  SOLVER_ENDPOINT,
  JOB_STATUS_ENDPOINT,
  SOLVER_JOB_ENDPOINT,
  SOLVER_TASKS_ENDPOINT,
  SOLVER_RECIPES_ENDPOINT,
  RULESETS_ENDPOINT,
  CREW_GROUPS_ENDPOINT,
  SOLVER_SCOPES_ENDPOINT,
  SOLVER_KPI_ENDPOINT,
  SOLVER_FAVOURITE_ENDPOINT,
} from './constants';
import { getUserId, buildBulkRequestDataParam } from './utils';

export function launchSolverRequest(userId, requestPayload = null) {
  const params = `userId=${userId}`;
  return API.post(`${SOLVER_JOB_ENDPOINT}?${params}`, requestPayload);
}

export function stopSolverRequest(
  scenarioId,
  solverId,
  userId,
  requestPayload = null
) {
  const params = `scenarioId=${scenarioId}&solverId=${solverId}&userId=${userId}&action=ABORT`;
  return API.put(`${SOLVER_JOB_ENDPOINT}?${params}`, requestPayload);
}

export function getSolverRequests(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${SOLVER_ENDPOINT}?${params}`);
}

export function getSolverRequestById(scenarioId, userId, requestId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${SOLVER_ENDPOINT}/${requestId}?${params}`);
}

export function getSolverStatistics(userId, scenarioId, requestPayload = null) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${SOLVER_KPI_ENDPOINT}?${params}`, requestPayload);
}

export function createRequest(scenarioId, userId, solverRequest) {
  const postData = buildBulkRequestDataParam(solverRequest);
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${SOLVER_ENDPOINT}?${params}`, postData);
}

export function getJobStatus(jobList, userId) {
  const params = `userId=${userId}`;
  const postData = jobList;
  return API.post(`${JOB_STATUS_ENDPOINT}?${params}`, postData);
}

export function updateRequest(scenarioId, userId, solverRequest) {
  const putData = buildBulkRequestDataParam(solverRequest);
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.put(`${SOLVER_ENDPOINT}?${params}`, putData);
}

export function deleteRequest(scenarioId, userId, requestIds) {
  // const deleteData = buildBulkDeleteRequestDataParam(requestIds);
  // const params = `userId=${userId}&scenarioId=${scenarioId}`;
  // return API.put(`${SOLVER_ENDPOINT}?${params}`, deleteData);
}

export function getSolverTasks(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${SOLVER_TASKS_ENDPOINT}?${params}`);
}

export function getSolverRecipes(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${SOLVER_RECIPES_ENDPOINT}?${params}`);
}

export function getRuleSets(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${RULESETS_ENDPOINT}?${params}`);
}

export function getCrewGroups(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${CREW_GROUPS_ENDPOINT}?${params}`);
}

export function getScopes(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${SOLVER_SCOPES_ENDPOINT}?${params}`);
}

export function getPreviewId(requestBody) {
  const userId = getUserId();

  const params = `userId=${userId}`;
  return API.post(`${SOLVER_ENDPOINT}/solution-preview?${params}`, requestBody);
}

export function savePreview(previewId, scenarioId) {
  const userId = getUserId();
  const postData = [
    {
      importMode: 'replace-mock-absent-current-crewgroup',
      scenarioId: scenarioId,
    },
  ];
  const params = `previewId=${previewId}&userId=${userId}`;

  return API.post(`${SOLVER_ENDPOINT}/savePreview?${params}`, postData);
}
export function setFavourite(scenarioId, userId, bodyData = {}) {
  const postData = bodyData;
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${SOLVER_FAVOURITE_ENDPOINT}?${params}`, postData);
}
