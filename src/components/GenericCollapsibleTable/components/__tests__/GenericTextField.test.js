import React from 'react';
import { mount } from 'enzyme';
import GenericTextField from '../GenericTextField';

const mockProps = {
  data: { name: 'hello' },
  onChange: value => value,
  value: 11,
  style: { width: '55px' },
  handleDisable: () => false,
  handleReset: () => false,
  enableReset: false,
  handleTooltipDisable: () => false,
  getTooltipContent: () => false,
  error: false,
  type: 'number',
  maxInputLength: 7,

  rightPadding: '',
  placeholder: '',
};

let wrapper;
beforeAll(() => {
  wrapper = mount(<GenericTextField {...mockProps} />);
});

afterAll(() => {
  wrapper.unmount();
});

test('GenericTextField Component render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('check whether onChange event is working', () => {
  expect(wrapper.state('value')).toEqual(11);
});
