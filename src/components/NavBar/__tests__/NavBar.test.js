import React from 'react';
import { shallow } from 'enzyme';
import { NavBar } from '../NavBar';

const minProps = {
  t: jest.fn(),
  loggedUser: {
    id: 1,
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.com',
    role: 'Planner',
    userName: 'test',
  },
  notificationsCount: 0,
  notificationViewed: jest.fn(),
  updateNotificationAsSeen: jest.fn(),
  viewedAllStatus: jest.fn(),
  notificationCleanUp: jest.fn(),
  closeNavBar: false,
  closeNotificationBar: jest.fn(),
};

let wrapper;
describe(`Test Suite for Navbar`, () => {
  beforeEach(() => {
    wrapper = shallow(<NavBar {...minProps} />);
  });

  test(`NavBar component renders`, () => {
    expect(wrapper).toMatchSnapshot();
  });

  test(`check handleMenu works as expected`, () => {
    expect(wrapper.state('anchorEl')).toBeNull();
    wrapper.instance().handleMenu({ currentTarget: 'test' });
    expect(wrapper.state('anchorEl')).toBe('test');
  });

  test(`check handleClose works as expected`, () => {
    expect(wrapper.state('anchorEl')).toBeNull();
    wrapper.instance().handleMenu({ currentTarget: 'test' });
    expect(wrapper.state('anchorEl')).toBe('test');
    wrapper.instance().handleClose();
    expect(wrapper.state('anchorEl')).toBeNull();
  });

  test(`check getRoute return exepected output`, () => {
    expect(wrapper.instance().getRoute()).toBe('/');
  });

  test(`check toggleNotificationPane works as expected`, () => {
    wrapper.instance().toggleNotificationPane();
    expect(wrapper.state('isNotificationsOpen')).toBeTruthy();
    wrapper.instance().toggleNotificationPane();
    expect(wrapper.state('isNotificationsOpen')).toBeFalsy();
  });
});
