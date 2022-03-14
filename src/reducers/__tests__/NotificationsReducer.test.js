import { genericReducer } from '../generic';
import { GENERAL } from '../../constants';

const defaultState = {
  count: 0,
  temp: [],
  notifications: [],
  totalSize: 0,
  isFetching: false,
  start: 0,
  viewedAll: false,
  closeNavBar: false,
};
const newNotification = [
  {
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
  },
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

describe(`Tests to check all the state changes for different actionstypes in the generic reducer`, () => {
  test(`check whether the count increases as expected `, () => {
    const newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_INCREMENT,
      payload: 2,
    });
    expect(newState.count).toBe(2);
  });
  test(`check whether the count resets to default value`, () => {
    const newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_RESET,
      payload: 0,
    });
    expect(newState.count).toBe(0);
  });
  test(`check whether the state changes when a new response comes in`, () => {
    const newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_SUCCESS,
      payload: { notViewedCount: 12, data: [], totalCount: 42, startIndex: 10 },
    });
    expect(newState.count).toBe(12);
    expect(newState.notifications.length).toBe(0);
    expect(newState.isFetching).toBeFalsy();
    expect(newState.totalSize).toBe(42);
    expect(newState.start).toBe(10);
  });

  test(`check whether the  isFetching state changes as per request `, () => {
    let newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_FETCHING,
      bool: true,
    });
    expect(newState.isFetching).toBeTruthy();
    newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_FETCHING,
      bool: false,
    });
    expect(newState.isFetching).toBeFalsy();
  });
  test(`check whether the new notiification is added to the default state `, () => {
    //adding some dummy data to default state
    const dummyState = {
      ...defaultState,
      notifications: [newNotification[0]],
      start: 0,
      totalSize: 1,
    };

    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_ADD,
      payload: newNotification[1],
    });
    expect(newState.start).toBe(1);
    expect(newState.totalSize).toBe(2);
    expect(newState.notifications).toHaveLength(2);
    expect(newState.notifications[0].viewStatus).toBe('UNSEEN');
  });
  test('check when an api call is in progress the new notification is added to temp', () => {
    const dummyState = { ...defaultState, isFetching: true };
    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_ADD,
      payload: newNotification[1],
    });
    expect(newState.notifications).toHaveLength(0);
    expect(newState.temp).toHaveLength(1);
  });
  test('check whether the temp data is added when api call is completed ', () => {
    const dummyState = {
      ...defaultState,
      temp: [...defaultState.temp, newNotification[0]],
    };
    expect(dummyState.notifications).toHaveLength(0);
    expect(dummyState.temp).toHaveLength(1);
    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_SUCCESS,
      payload: {
        notViewedCount: 2,
        data: [newNotification[1]],
        totalCount: 42,
        startIndex: 10,
      },
    });
    expect(newState.temp).toHaveLength(0);
    expect(newState.notifications).toHaveLength(2);
    expect(newState.start).toBe(11);
    expect(newState.totalSize).toBe(42);
    expect(newState.isFetching).toBe(false);
  });
  test(`check deleting all data clears everything`, () => {
    const dummyState = {
      ...defaultState,
      ...{
        count: 2,
        notifications: [newNotification[1]],
        totalSize: 42,
        start: 10,
      },
    };
    expect(dummyState.count).toBe(2);
    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_ALL_DELETE,
    });
    expect(newState.start).toBe(0);
    expect(newState.count).toBe(0);
    expect(newState.totalSize).toBe(0);
    expect(newState.notifications).toHaveLength(0);
  });

  test('check the notification close is toggled as per payload', () => {
    expect(defaultState.closeNavBar).toBeFalsy();
    let newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_BAR_CLOSE,
      bool: true,
    });
    expect(newState.closeNavBar).toBeTruthy();
    newState = genericReducer(defaultState, {
      type: GENERAL.NOTIFICATION_BAR_CLOSE,
      bool: false,
    });
    expect(newState.closeNavBar).toBeFalsy();
  });

  test('check whether the single delete removes a data from state', () => {
    const dummyState = {
      ...defaultState,
      notifications: newNotification,
      count: 2,
      totalSize: 2,
      start: 0,
    };
    expect(dummyState.notifications).toHaveLength(2);
    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_SINGLE_DELETE,
      notificationId: '139288-data-test-2',
    });
    expect(newState.notifications).toHaveLength(1);
    newState.notifications.forEach(notification => {
      expect(notification.eventId).not.toBe('139288-data-test-2');
    });
  });

  test(`check whether the all seen works as expected `, () => {
    const dummyState = {
      ...defaultState,
      notifications: newNotification,
      count: 2,
      totalSize: 2,
      start: 0,
    };
    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_ALL_SEEN,
    });
    newState.notifications.forEach(notification => {
      expect(notification.viewStatus).toBe('SEEN');
    });
    expect(newState.viewedAll).toBeFalsy();
  });

  test(`check whether setting the view all status changes as per request`, () => {
    expect(defaultState.viewedAll).toBeFalsy();
    const newState = genericReducer(defaultState, {
      type: GENERAL.VIEWED_ALL_NOTIFICATION,
    });
    expect(newState.viewedAll).toBeTruthy();
  });
  test(`check whether the cleanup action returns the state back to default`, () => {
    const dummyState = {
      ...defaultState,
      notifications: newNotification,
      count: 2,
      totalSize: 2,
      start: 0,
    };
    expect(dummyState).not.toMatchObject(defaultState);
    const newState = genericReducer(dummyState, {
      type: GENERAL.NOTIFICATION_CLEANUP,
    });
    expect(newState).toMatchObject(defaultState);
  });
});
