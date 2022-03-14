import { createRequest, filterResponse } from '../helper';
import storage from '../../../utils/storage';

storage.setItem('loggedUser', { id: 1, role: 'Planner' });
storage.setItem('openScenario', { id: '1184' });
const wsMockData = {
  headers: {
    NotificationType: 'solver',
    RegistrationIDs: '9902ff7b19d36f9475588a3de886be5f70fa10e2solver2',
    Time: '11/27/2020 12:17:38',
  },
  payload: {
    data: {
      activeTime: '0:00:03',
      alertType: 'NOTICE',
      creationDateTime: '2020-11-27T12:17:34+0000',
      elapsedTime: '0:00:00',
      eventId: '74-Daily----fail',
      eventType: 'solver',
      jobId: '74-Daily----fail',
      jobOwner: '1',
      lastModified: '2020-11-27T12:17:37+0000',
      scenarioId: '1184',
      scenarioName: 'Geordy Scenario 2019 July',
      solverId: '3',
      solverName: 'Daily -- fail',
      state: 'queued',
      status: 'Waiting',
    },
    role: 'Planner',
    userId: '1',
  },
};
describe(`Test suite to verify Rtns helper functions`, () => {
  test(`check whether the createRequest gives expected output`, () => {
    const expectedOutput = {
      notificationType: 'solver',
      filterCriteria: {},
    };
    expect(createRequest('solver', {})).toMatchObject(expectedOutput);
  });

  test(`check whether the filterResponse provides correct output for NOTICE type`, () => {
    expect(filterResponse(wsMockData, jest.fn()).notify).toBeFalsy();
  });

  test(`check whether the filterResponse provides correct output for SUCCESS type`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: { ...wsMockData.payload.data, alertType: 'SUCCESS' },
      },
    };
    expect(filterResponse(newWsData, jest.fn()).notify).toBeTruthy();
  });

  test(`check whether the filterResponse provides correct output for ERROR type`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: { ...wsMockData.payload.data, alertType: 'ERROR' },
      },
    };
    expect(filterResponse(newWsData, jest.fn()).notify).toBeTruthy();
  });
});
