import API from './api';
import constants from './constants';

const { ENDPOINT, ENDPOINT_SUMMARY } = constants;

function getUsers() {
  return API.get(`${ENDPOINT_SUMMARY}`);
}

function getUserDetails(userId) {
  return API.get(`${ENDPOINT}/${userId}`);
}

function getRoles() {
  return API.get(`${ENDPOINT}/roles`);
}

function createUser(userData) {
  const data = { objects: [userData] };

  return API.post(ENDPOINT, data);
}

function deleteUser(userId) {
  const data = [userId];

  return API.delete(ENDPOINT, { data });
}

function updateUser(userData) {
  const data = { objects: [userData] };

  return API.put(ENDPOINT, data);
}

export default {
  createUser,
  deleteUser,
  getRoles,
  getUsers,
  getUserDetails,
  updateUser,
};
