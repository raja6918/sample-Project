import React from 'react';
import { mount } from 'enzyme';
import Switch from '../Switch';

const minProps = {
  checked: false,
  name: 'testSwitch',
  onChange: jest.fn(),
  label: 'test label',
};

const wrapper = mount(<Switch {...minProps} />);

test('Switch component render correct', () => {
  expect(wrapper).toMatchSnapshot();
});
