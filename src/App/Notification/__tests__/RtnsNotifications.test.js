import React from 'react';
import { shallow } from 'enzyme';
import windowSpy from '../windowMock';
import storage from '../../../utils/storage';
import { RtnsNotifications } from '../RtnsNotifications';

const minProps = {
  t: jest.fn(() => ''),
  notificationsCount: jest.fn(),
  children: React.createElement('div', null, null),
  loggedUser: { id: 1, role: 'Planner' },
  updateJobStatus: jest.fn(),
  notificationDecrement: jest.fn(),
  getInitialNotifications: jest.fn(),
  readOnly: false,
  addNewNotificationToStore: jest.fn(),
  setUserDetails: jest.fn(),
};
const notificationRegisterMock = {
  clientID: '9902ff7b19d36f9475588a3de886be5f70fa10e2',
  registerID: '9902ff7b19d36f9475588a3de886be5f70fa10e2generic1',
  notificationType: 'generic',
};

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

storage.setItem('loggedUser', { id: 1, role: 'Planner' });
storage.setItem('openScenario', { id: '1184' });
let wrapper;
describe(`Tests Related to Rtns component`, () => {
  beforeEach(() => {
    wrapper = shallow(<RtnsNotifications {...minProps} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('RtnsNotifications Component renders', () => {
    expect(wrapper).toMatchSnapshot();
  });
  test('check Rtns notificationRegisterSuccessFunc sets the registerId for each notification type', () => {
    expect(wrapper.state('notificationTypesWithIds')).toHaveLength(0);
    wrapper
      .instance()
      .notificationRegisterSuccessFunc(notificationRegisterMock);
    expect(wrapper.state('notificationTypesWithIds')).toHaveLength(1);
    expect(wrapper.state('notificationTypesWithIds')[0].clientID).toBe(
      notificationRegisterMock.clientID
    );
    expect(wrapper.state('notificationTypesWithIds')[0].registerID).toBe(
      notificationRegisterMock.registerID
    );
  });

  test(`check Rtns notificationRegisterSuccessFunc does not sets the state if regsiterId is not present `, () => {
    expect(wrapper.state('notificationTypesWithIds')).toHaveLength(0);
    wrapper.instance().notificationRegisterSuccessFunc({});
    expect(wrapper.state('notificationTypesWithIds')).toHaveLength(0);
  });

  test(`check whether the notificationMessageFunc works as expected for waiting status`, () => {
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
    wrapper.instance().notificationMessageFunc(wsMockData);
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
  });
  test(`check whether the notificationMessageFunc works as expected for waiting status`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: { ...wsMockData.payload.data, alertType: 'SUCCESS' },
      },
    };
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(1);
  });

  test(`check whether a notification does not comes up for same user but different scenario`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: {
          ...wsMockData.payload.data,
          scenarioId: '1123',
          alertType: 'SUCCESS',
        },
      },
    };
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
  });
  test(`check whether we get notification for ERROR alert types`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: {
          ...wsMockData.payload.data,
          alertType: 'ERROR',
        },
      },
    };
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(1);
  });

  test(`check notifications are properly added to array`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: {
          ...wsMockData.payload.data,
          alertType: 'ERROR',
        },
      },
    };
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(1);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(2);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(3);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(4);
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(5);
  });

  test(`test clearing a notification removes the notification from the state`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: {
          ...wsMockData.payload.data,
          alertType: 'ERROR',
        },
      },
    };
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(1);
    wrapper.instance().onClearSnackBar(newWsData.payload.data.eventId);
    expect(wrapper.state('notificationMessages')).toHaveLength(0);
  });

  test(`check whether an unknown eventId does not clear the notification state`, () => {
    const newWsData = {
      ...wsMockData,
      payload: {
        ...wsMockData.payload,
        data: {
          ...wsMockData.payload.data,
          alertType: 'ERROR',
        },
      },
    };
    wrapper.instance().notificationMessageFunc(newWsData);
    expect(wrapper.state('notificationMessages')).toHaveLength(1);
    wrapper.instance().onClearSnackBar(`123`);
    expect(wrapper.state('notificationMessages')).toHaveLength(1);
  });
});
