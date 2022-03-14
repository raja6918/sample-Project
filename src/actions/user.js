import { USER } from '../constants';

export const setUserDetails = payload => ({
  type: USER.SET_USER_DATA,
  payload,
});

export const userDataCleanUp = () => ({
  type: USER.USER_DATA_CLEAN_UP,
});

export const setPermissions = payload => ({
  type: USER.SET_PERMISSION,
  payload,
});
