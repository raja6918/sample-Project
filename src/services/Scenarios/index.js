import API from './api';
import constants from './constants';
import storage, { localStorage } from '../../utils/storage';

const { ENDPOINT, ENDPOINT_SUMMARY, CLOSE_PREVIEW_ENDPOINT } = constants;

function getUserId(userId) {
  if (!!userId) return userId;

  const loggedUser = storage.getItem('loggedUser');

  if (loggedUser && !!loggedUser.id) return loggedUser.id;

  return null;
}

function getScenarios(filter) {
  const userId = getUserId();
  const params = { userId };
  if (filter) params.filter = filter;
  return API.get(ENDPOINT_SUMMARY, { params });
}

function createScenario(scenarioData, usrId) {
  const userId = getUserId(usrId);
  const params = { userId };
  const data = { objects: [scenarioData] };
  return API.post(ENDPOINT, data, { params });
}

function deleteScenario(scenarioId, usrId, isPreview) {
  const userId = getUserId(usrId);
  const params = { isPreview, userId };
  const data = Array.isArray(scenarioId) ? scenarioId : [scenarioId];
  return API.delete(ENDPOINT, { data, params });
}

function updateScenario(scenarioData, usrId) {
  const userId = getUserId(usrId);
  const params = { userId };
  const data = { objects: [scenarioData] };
  return API.put(ENDPOINT, data, { params });
}

function openScenario(scenarioId) {
  const userId = getUserId();
  const endpoint = `${ENDPOINT}/${scenarioId}`;
  const params = {
    action: 'OPEN',
    userId,
  };
  return API.put(endpoint, null, { params });
}

function closeScenario(scenarioId) {
  const userId = getUserId();
  const endpoint = `${ENDPOINT}/${scenarioId}`;
  const params = {
    action: 'CLOSE',
    userId,
  };
  return API.put(endpoint, null, { params });
}

function getScenarioDetails(scenarioId) {
  const userId = getUserId();
  const endpoint = `${ENDPOINT}/${scenarioId}`;
  const params = { userId };
  return API.get(endpoint, { params });
}

function getScenarioDetailsWithError(scenarioId) {
  const userId = getUserId();
  const endpoint = `INVALID_ENDPOINT/${scenarioId}`;
  const params = { userId };
  return API.get(endpoint, { params });
}

function deletePreview(previewId, usrId, isPreview) {
  const userId = getUserId(usrId);
  const params = { isPreview, userId };
  const data = Array.isArray(previewId) ? previewId : [previewId];
  return API.delete(CLOSE_PREVIEW_ENDPOINT, { data, params });
}
async function deletePendingPreviews() {
  const userId = getUserId();
  const openPreview = storage.getItem('openPreview') || [];
  const deletedPreviews = localStorage.getItem('deletedPreviews') || [];
  localStorage.setItem('deletedPreviews', []);

  if (deletedPreviews.length !== 0 && openPreview.length === 0) {
    try {
      await deletePreview(
        deletedPreviews.map(i => Number(i)),
        userId,
        true
      );
    } catch (error) {
      console.error(error);
    }
  }
}

export default {
  createScenario,
  deleteScenario,
  getScenarios,
  openScenario,
  updateScenario,
  getScenarioDetails,
  getScenarioDetailsWithError,
  closeScenario,
  deletePendingPreviews,
  deletePreview,
};
