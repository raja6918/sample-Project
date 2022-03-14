import React from 'react';
import { shallow } from 'enzyme';
import TimeZone from '..';

const props = {
  t: jest.fn(),
};

test('TimeZone component render correct', () => {
  const wrapper = shallow(<TimeZone {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test('There should be 2 pickers on the component', () => {
  const wrapper = shallow(<TimeZone {...props} />);
  expect(wrapper.find('.picker-field').length).toBe(2);
});
