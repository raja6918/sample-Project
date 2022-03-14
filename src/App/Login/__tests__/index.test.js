import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';

import Login from '../index';

const props = {
  t: jest.fn(),
  history: {},
};

test('Login Component renders', () => {
  const wrapper = shallow(
    <Router initialEntries={['/testing']} initialIndex={0}>
      <Login {...props} />
    </Router>
  );
  expect(wrapper.instance().history.location.pathname).toBe('/testing');
  wrapper.instance().history.push('/');
  expect(wrapper.instance().history.location.pathname).toBe('/');
});

test('Snapshot is up to date', () => {
  const wrapper = shallow(<Login {...props} />);
  expect(wrapper).toMatchSnapshot();
});
