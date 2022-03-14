import { solverReducer } from '../solver';
import { SOLVER } from '../../constants';

const defaultState = {
  latestJob: [],
};
const notification = {
  activeTime: '0:00:10',
  creationDateTime: '2020-08-12T07:57:15+0000',
  elapsedTime: '0:00:15',
  jobId: '139288-data-test',
  eventId: '139288-data-test',
  lastModified: '2020-08-12T07:57:20+0000',
  message: null,
  status: 'Done-success',
  alertType: 'SUCCESS',
  solverName: 'data test',
  scenarioId: '3',
  scenarioName: 'Jazz Template with Pairings',
  jobOwner: '5',
  state: 'Done-success',
  eventType: 'solver',
  solverId: '46',
  notificationType: 'solver',
};

const showErrors = true;

describe(`Test suite related to solvers`, () => {
  test(`check when a new notification comes in the default state is updated as per`, () => {
    const newState = solverReducer(defaultState, {
      type: SOLVER.PUSH_LATEST_JOB_STATUS,
      payload: notification,
    });
    expect(newState.latestJob).toHaveLength(1);
  });

  test(`check whether the showErrors field got updated as per`, () => {
    const newState = solverReducer(defaultState, {
      type: SOLVER.TRIGGER_SHOW_ERRORS,
      bool: showErrors,
    });
    expect(newState.showErrors).toBe(true);
  });
});
