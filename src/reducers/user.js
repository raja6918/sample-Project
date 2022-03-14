import { USER } from '../constants';

import { permissionListModifier } from './utils';

const initialState = {
  userData: {},
  permissions: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER.SET_USER_DATA: {
      return { ...state, userData: action.payload };
    }
    case USER.USER_DATA_CLEAN_UP: {
      return {
        ...state,
        ...initialState,
      };
    }
    case USER.SET_PERMISSION: {
      return {
        ...state,
        permissions: permissionListModifier(action.payload),
      };
    }
    default:
      return state;
  }
};
