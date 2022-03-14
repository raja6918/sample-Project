import apiUtils from '../../utils/API/utils';

const userAPI = apiUtils.buildAPI(apiUtils.getConfig().PAIRING_API);

export default userAPI;
