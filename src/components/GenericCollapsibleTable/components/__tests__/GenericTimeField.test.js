import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import GenericTimeField from '../GenericTimeField';

jest.mock('moment', () => {
  return jest.fn(() => '02.00');
});

const mockProps = {
  data: { name: 'hello' },
  onChange: value => value,
  value: '02.00',
  style: { width: '55px' },
  handleDisable: () => false,
  handleReset: () => false,
  enableReset: false,
  handleTooltipDisable: () => false,
  getTooltipContent: () => false,
  error: false,
};

let wrapper;
beforeAll(() => {
  wrapper = shallow(<GenericTimeField {...mockProps} />);
});

test('GenericTimeField Component render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('check whether onChange event is working', () => {
  expect(wrapper.state('value')).toEqual(moment('02.00', 'HH:mm'));
});
