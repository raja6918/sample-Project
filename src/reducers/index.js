import { combineReducers } from 'redux';
import { solverReducer } from './solver';
import { genericReducer } from './generic';
import { scenarioReducer } from './scenario';
import { userReducer } from './user';
import { dataReducer } from './data';
import { pairingReducer } from './pairings';

const rootReducer = combineReducers({
  notifications: genericReducer,
  newJobStatus: solverReducer,
  scenario: scenarioReducer,
  user: userReducer,
  data: dataReducer,
  pairing: pairingReducer,
});

export default rootReducer;
