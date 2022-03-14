import { SCENARIOS } from '../constants';

export const currentUserUpdated = bool => ({
  type: SCENARIOS.SET_CURRENT_USER,
  bool,
});
