import { SCENARIOS } from '../constants';

const scenarioState = {
  currentUserUpdated: false,
};

export const scenarioReducer = (state = scenarioState, action) => {
  switch (action.type) {
    case SCENARIOS.SET_CURRENT_USER: {
      return { ...state, currentUserUpdated: action.bool };
    }
    default:
      return state;
  }
};
