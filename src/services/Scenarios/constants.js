import apiUtils from '../../utils/API/utils';

const API_URL = apiUtils.getConfig().SCENARIO_API;
const ENDPOINT = '/scenarios';
const ENDPOINT_SUMMARY = `${ENDPOINT}/summary`;
const ENDPOINT_CATEGORIES = `${ENDPOINT}/categories`;
const CLOSE_PREVIEW_ENDPOINT = `${ENDPOINT}/close-preview`;
const constants = {
  API_URL,
  ENDPOINT,
  ENDPOINT_SUMMARY,
  ENDPOINT_CATEGORIES,
  CLOSE_PREVIEW_ENDPOINT,
};

export default constants;
