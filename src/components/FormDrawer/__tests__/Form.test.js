import React from 'react';
import { shallow, mount } from 'enzyme';

import Drawer from '@material-ui/core/Drawer';

import Form from '../Form';

const fnOk = jest.fn();
const minProps = {
  formId: 'stationForm',
  handleCancel: jest.fn(),
  isDisabled: false,
  onChange: jest.fn(),
  anchor: 'right',
  isOpen: true,
  handleOk: fnOk,
};

test('Form renders correctly', () => {
  const wrapper = shallow(<Form {...minProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('Form Component renders id and name correctly', () => {
  const wrapper = mount(<Form {...minProps} />);

  expect(wrapper.find('form').prop('id')).toBe(minProps.formId);
  expect(wrapper.find('form').prop('name')).toBe(minProps.formId);
});

test('Form Component handle submit', () => {
  const wrapper = mount(<Form {...minProps} />);
  wrapper.find('form').simulate('submit', {
    target: wrapper
      .find(Drawer)
      .children()
      .at(0),
  });
});
