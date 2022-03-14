import apiUtils from '../../utils/API/utils';

const API_URL = apiUtils.getConfig().USER_API;
const ENDPOINT = '/users';
const ENDPOINT_SUMMARY = `${ENDPOINT}/summary`;

const constants = { API_URL, ENDPOINT, ENDPOINT_SUMMARY };

export default constants;
