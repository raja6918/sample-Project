import React from 'react';
import { mount } from 'enzyme';

import ScenarioForm from '../ScenarioForm';
import { start } from 'repl';

const minProps = {
  open: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
  t: jest.fn(),
  formId: 'scenarioForm',
  onClose: jest.fn(),
  template: 'Template Name',
  okButton: 'Ok',
  cancelButton: 'Cancel',
};

const wrapper = mount(<ScenarioForm {...minProps} />);

test('ScenarioForm renders without crashing', () => {
  expect(wrapper).toMatchSnapshot();
});

test('scenarioNameChange changes scenarioname correct', () => {
  const e = {
    target: {
      value: 'new scenario name',
    },
  };
  wrapper.instance().scenarioNameChange(e);
  const scenarioName = wrapper.state('scenarioName');
  expect(scenarioName).toBe('new scenario name');
});

test('handleChange changes date/rangeDate correct', () => {
  wrapper.instance().handleChange('2018-12-05T17:25:02.917Z');
  const startDate = wrapper.state('startDate');
  const rangeDate = wrapper.state('rangeDate');
  expect(startDate).toBe('2018-12-05T17:25:02.917Z');
  expect(rangeDate).toBe('DEC 05, 2018 - JAN 03, 2019');
});

test('handleOnFormEnter adds a listener correct', () => {
  wrapper.instance().handleOnFormEnter();
});

test('handleFormClose removes a listener correct', () => {
  wrapper.instance().handleFormClose();
});

test('handleChangeRangeDate changes duration correct', () => {
  const e = {
    target: {
      value: '50',
    },
  };
  wrapper.instance().handleChangeRangeDate(e);
  const duration = wrapper.state('duration');
  expect(duration).toBe('50');
});

test('willReceiveProps changes to initial state correct', () => {
  wrapper.setProps({ open: false });
  const duration = wrapper.state('duration');
  expect(duration).toBe(30);
});
