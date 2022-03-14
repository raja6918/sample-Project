import React from 'react';
import { shallow } from 'enzyme';

import NotificationCard from '../NotificationCard';

const t = jest.fn();
const deleteNotification = jest.fn();
const notificationResponse = {
  notificationId: 1,
  scenarioName: 'July 2020 Production',
  solverRequestName: 'Combo Pilots',
  solverStatus: 'Done-success',
  timestamp: '27 June, 2020 at 19:02',
  unread: true,
};

test('NotificationCard component renders correct', () => {
  const wrapper = shallow(
    <NotificationCard
      t={t}
      deleteNotification={deleteNotification}
      notificationResponse={notificationResponse}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
