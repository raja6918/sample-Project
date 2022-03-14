import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import storage from '../../utils/storage';
import Auth from '../Auth';

afterEach(() => {
  storage.clear();
});

test('Auth Component renders a component when user is signed in', () => {
  storage.setItem('logged-in', true);
  const Component = () => <div>Hello World</div>;
  const wrapper = shallow(<Auth path="/test" component={Component} />);

  expect(wrapper.props().component.name).toBe('Component');
});

test('Auth Component redirect to /login when user is not signed in', () => {
  storage.clear();
  storage.setItem('logged-in', false);
  const Component = () => <div>Hello World</div>;
  const wrapper = shallow(
    <Auth path="/login" render={props => <Component />} />
  );

  expect(wrapper.find(Route)).toHaveLength(1);
  expect(wrapper.find(Route).props().path).toBe('/login');
});
