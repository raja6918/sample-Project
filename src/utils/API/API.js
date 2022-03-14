import utils from './utils';

const config = utils.getConfig();
const API = utils.buildAPI(config.USER_API);

export default API;
