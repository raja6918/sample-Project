import { SOLVER } from '../constants';

const initialState = {
  latestJob: [],
  validationErrorFields: { cg: false, rs: false },
  showErrors: false,
};

export const solverReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOLVER.PUSH_LATEST_JOB_STATUS: {
      state = { ...state, latestJob: [action.payload] };
      break;
    }

    case SOLVER.TRIGGER_SHOW_ERRORS: {
      state = { ...state, showErrors: action.bool };
      break;
    }
    default:
  }
  return state;
};
