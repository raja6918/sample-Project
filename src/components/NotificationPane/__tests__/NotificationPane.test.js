import React from 'react';
import { shallow } from 'enzyme';

import { NotificationPane } from '../NotificationPane';

const notificationResponse = [
  {
    notificationId: 1,
    scenarioName: 'July 2020 Production',
    solverRequestName: 'Combo Pilots',
    solverStatus: 'Done-success',
    timestamp: '27 June, 2020 at 19:02',
    unread: true,
  },
  {
    notificationId: 4,
    scenarioName: 'September 2020 Production',
    solverRequestName: 'Pilots 777',
    solverStatus: 'Done-success',
    timestamp: '27 June, 2020 at 19:02',
  },
];

test('NotificationPane component renders correct', () => {
  const minProps = {
    t: jest.fn(),
    isOpen: true,
    handleCancel: jest.fn(),
    notificationResponse: notificationResponse,
    fetchDataOnScroll: jest.fn(),
    deleteSingleNotification: jest.fn(),
    deleteAllNotification: jest.fn(),
  };
  const wrapper = shallow(<NotificationPane {...minProps} />);
  expect(wrapper).toMatchSnapshot();
});
