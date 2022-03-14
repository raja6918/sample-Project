import apiUtils from '../../utils/API/utils';

const homeAPI = apiUtils.buildAPI(apiUtils.getConfig().HOME_API);

export default homeAPI;
