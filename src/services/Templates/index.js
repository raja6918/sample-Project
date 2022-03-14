import API from './api';
import constants from './constants';
import storage from '../../utils/storage';

const { ENDPOINT, ENDPOINT_SUMMARY, ENDPOINT_CATEGORIES } = constants;

function getUserId(userId) {
  if (!!userId) return userId;

  const loggedUser = storage.getItem('loggedUser');

  if (loggedUser && !!loggedUser.id) return loggedUser.id;

  return null;
}

function getTemplates() {
  const userId = getUserId();
  const params = { userId };
  return API.get(ENDPOINT_SUMMARY, { params });
}

function createTemplate(templateData, usrId) {
  const userId = getUserId(usrId);
  const params = { userId };
  const data = { objects: [templateData] };
  return API.post(ENDPOINT, data, { params });
}

function deleteTemplate(templateId, usrId) {
  const userId = getUserId(usrId);
  const params = { userId };
  const data = [templateId];
  return API.delete(ENDPOINT, { data, params });
}

function updateTemplate(templateData, usrId) {
  const userId = getUserId(usrId);
  const params = { userId };
  const data = { objects: [templateData] };
  return API.put(ENDPOINT, data, { params });
}

function getCategories() {
  const userId = getUserId();
  const params = { userId };
  return API.get(ENDPOINT_CATEGORIES, { params });
}

function openTemplate(templateId) {
  const userId = getUserId();
  const endpoint = `${ENDPOINT}/${templateId}`;
  const params = {
    action: 'OPEN',
    userId,
  };
  return API.put(endpoint, null, { params });
}

function closeTemplate(templateId) {
  const userId = getUserId();
  const endpoint = `${ENDPOINT}/${templateId}`;
  const params = {
    action: 'CLOSE',
    userId,
  };
  return API.put(endpoint, null, { params });
}

export default {
  createTemplate,
  deleteTemplate,
  getCategories,
  getTemplates,
  updateTemplate,
  openTemplate,
  closeTemplate,
};
