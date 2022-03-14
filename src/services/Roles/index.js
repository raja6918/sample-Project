import API from './api';
import { ROLES_ENDPOINT, PERMISION_ENDPOINT } from './constants';
import { getUserId } from '../Data/utils';

export function getPermision() {
  const userId = getUserId();
  const params = `userId=${userId}`;
  return API.get(`${PERMISION_ENDPOINT}?${params}`);
}

export function getUserRoles() {
  return API.get(ROLES_ENDPOINT);
}

export function createUserRole(requestPayload = null) {
  return API.post(ROLES_ENDPOINT, requestPayload);
}

export function getUserRoleById(roleId) {
  return API.get(`${ROLES_ENDPOINT}/get/${roleId}`);
}
export function deleteUserRole(roleId) {
  const data = {};
  return API.delete(`${ROLES_ENDPOINT}/${roleId}`, {
    data,
  });
}

export function updateUserRole(requestPayload = null) {
  return API.put(`${ROLES_ENDPOINT}`, requestPayload);
}
