import apiUtils from '../../utils/API/utils';

const userAPI = apiUtils.buildAPI(apiUtils.getConfig().USER_API);

export default userAPI;
