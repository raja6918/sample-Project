import apiUtils from '../../utils/API/utils';

const API_URL = apiUtils.getConfig().SCENARIO_API;
const ENDPOINT = '/templates';
const ENDPOINT_SUMMARY = `${ENDPOINT}/summary`;
const ENDPOINT_CATEGORIES = `${ENDPOINT}/categories`;
const constants = { API_URL, ENDPOINT, ENDPOINT_SUMMARY, ENDPOINT_CATEGORIES };

export default constants;
