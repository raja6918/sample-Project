import React from 'react';
import { shallow } from 'enzyme';
import GenericDateField from '../GenericDateField';

const mockProps = {
  data: { name: 'hello' },
  onChange: value => value,
  value: '2019-01-01',
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
  wrapper = shallow(<GenericDateField {...mockProps} />);
});

test('GenericDateField Component render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('check whether onChange event is working', () => {
  expect(wrapper.state('value')).toEqual('2019-01-01');
});
