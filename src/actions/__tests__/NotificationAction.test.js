import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as notificationService from '../../services/Notifications';
import {
  notificationIncrement,
  notificationDecrement,
  addNotificationsToStore,
  viewedAllStatus,
  notificationCleanUp,
  closeNotificationBar,
  addNewNotificationToStore,
  fetchingNotification,
  deleteSingleNotification,
  deleteAllNotification,
  updateNotificationAsSeen,
  fetchNotifications,
} from '../generic';
import { GENERAL } from '../../constants';

const newNotification = {
  data: [
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
  ],
  totalCount: 2,
  startIndex: 0,
  notViewedCount: 2,
};

notificationService.getNotifications = jest.fn(() =>
  Promise.resolve(newNotification)
);
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
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
const store = mockStore(defaultState);

describe(`Tests related to Notification Actions`, () => {
  beforeEach(() => {
    store.clearActions();
  });

  test(`check notification increment action gets dispatched as expected`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_INCREMENT,
        payload: 1,
      },
    ];
    store.dispatch(notificationIncrement(1));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test('check notification reset works as expected', () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_RESET,
        payload: 0,
      },
    ];
    store.dispatch(notificationDecrement(0));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check adding a notification action is dispatched properly`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_SUCCESS,
        payload: newNotification.data[0],
      },
    ];
    store.dispatch(addNotificationsToStore(newNotification.data[0]));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check the view all action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.VIEWED_ALL_NOTIFICATION,
      },
    ];
    store.dispatch(viewedAllStatus());
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });
  test(`check the clean up action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_CLEANUP,
      },
    ];
    store.dispatch(notificationCleanUp());
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check the notification Bar action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_BAR_CLOSE,
        bool: true,
      },
    ];
    store.dispatch(closeNotificationBar(true));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the single notificationw action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_ADD,
        payload: newNotification.data[0],
      },
    ];
    store.dispatch(addNewNotificationToStore(newNotification.data[0]));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the fetching notification action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_FETCHING,
        bool: true,
      },
    ];
    store.dispatch(fetchingNotification(true));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the single delete notification action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_SINGLE_DELETE,
        notificationId: 1,
      },
    ];
    store.dispatch(deleteSingleNotification(1));
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the add delete notification action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_ALL_DELETE,
      },
    ];
    store.dispatch(deleteAllNotification());
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the update all notification action is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_ALL_SEEN,
      },
    ];
    store.dispatch(updateNotificationAsSeen());
    expect(store.getActions()).toEqual(expectedResult);
    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the fetch data action without scroll is dispatched`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_FETCHING,
        bool: true,
      },
    ];

    store.dispatch(fetchNotifications(1)).then(() => {
      expect(store.getActions()[0]).toEqual(expectedResult);
      expect(store.getActions()[1]).toEqual([
        { ...expectedResult[0], bool: false },
      ]);
    });

    expect(store.getActions()).toMatchSnapshot();
  });

  test(`check whether the fetch action works correctly with scroll`, () => {
    const expectedResult = [
      {
        type: GENERAL.NOTIFICATION_FETCHING,
        bool: true,
      },
    ];

    store.dispatch(fetchNotifications(1, true)).then(() => {
      expect(store.getActions()[0]).toEqual(expectedResult);
      expect(store.getActions()[1]).toEqual([
        { ...expectedResult[0], bool: false },
      ]);
    });

    expect(store.getActions()).toMatchSnapshot();
  });
});
