import { DATA } from '../constants';

export const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case DATA.SET_MASTER_DATA: {
      return { ...state, [action.key]: action.data };
    }
    case DATA.CLEAR_MASTER_DATA: {
      return {};
    }
    default:
      return state;
  }
};
