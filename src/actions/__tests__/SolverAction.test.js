import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { updateJobStatus, triggerShowErrors } from '../solver';
import { SOLVER } from '../../constants';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const defaultState = {
  latestJob: [],
};
const store = mockStore(defaultState);
const defaultpayload = [
  {
    activeTime: '0:00:10',
    creationDateTime: '2020-08-12T07:57:15+0000',
    elapsedTime: '0:00:15',
    jobId: '139288-data-test-2',
    eventId: '139288-data-test-2',
    lastModified: '2020-08-12T07:57:20+0000',
    message: null,
    status: 'Done-failed',
    alertType: 'ERROR',
    solverName: 'data test 2',
    scenarioId: '3',
    scenarioName: 'Test',
    jobOwner: '5',
    state: 'Done-failed',
    eventType: 'solver',
    solverId: '48',
    notificationType: 'solver',
  },
];
const payloadForShowErrors = false;

describe(`Tests related to Solver Actions`, () => {
  beforeEach(() => {
    store.clearActions();
  });
  test(`check solver push action gets dispatched as expected`, () => {
    const expectedResult = [
      {
        type: SOLVER.PUSH_LATEST_JOB_STATUS,
        payload: defaultpayload,
      },
    ];
    store.dispatch(updateJobStatus(defaultpayload));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check show error field  gets triggered as expected`, () => {
    const expectedOutput = [
      {
        type: SOLVER.TRIGGER_SHOW_ERRORS,
        bool: payloadForShowErrors,
      },
    ];
    store.dispatch(triggerShowErrors(payloadForShowErrors));
    expect(store.getActions()).toEqual(expectedOutput);
    expect(store.getActions()).toMatchSnapshot();
  });
});
