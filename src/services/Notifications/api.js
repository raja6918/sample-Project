import apiUtils from '../../utils/API/utils';

const notificationAPI = apiUtils.buildAPI(
  apiUtils.getConfig().NOTIFICATION_API
);

export default notificationAPI;
