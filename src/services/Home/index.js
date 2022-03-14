import API from './api';
import { HOME_ENDPOINT } from './constants';

export function getDataHomeCards(scenarioId, userId) {
  const params = `userId=${userId}&scenarioId=${scenarioId}`;
  return API.get(`${HOME_ENDPOINT}?${params}`);
}

export default {
  getDataHomeCards,
};
