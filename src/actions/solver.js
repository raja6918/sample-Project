import { SOLVER } from '../constants';

export const updateJobStatus = payload => ({
  type: SOLVER.PUSH_LATEST_JOB_STATUS,
  payload: payload,
});

export const triggerShowErrors = bool => ({
  type: SOLVER.TRIGGER_SHOW_ERRORS,
  bool,
});
