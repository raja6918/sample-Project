import React from 'react';
import { shallow } from 'enzyme';
import ScenarioInfo from '../ScenarioInfo';

const minProps = {
  anchor: 'right',
  isOpen: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
  scenario: {
    id: '1',
    name: 'Scenario Test',
    createdBy: 'Barraza',
  },
  t: jest.fn(),
};

const wrapper = shallow(<ScenarioInfo {...minProps} />);

test('ScenarioInfo renders without crashing', () => {
  expect(wrapper).toMatchSnapshot();
});

test('handletabChange changes correct tab', () => {
  wrapper.instance().handleTabChange({}, 1);
  const tabIndex = wrapper.state('tabIndex');
  expect(tabIndex).toBe(1);
});

test('onFormChange checks if form is dirty correct', () => {
  wrapper.instance().onFormChange();
  const isFormDirty = wrapper.state('isFormDirty');
  expect(isFormDirty).toBe(true);
});

test('willReceiveProps changes to initial state correct', () => {
  wrapper.setProps({ isOpen: false });
  const isFormDirty = wrapper.state('isFormDirty');
  const name = wrapper.state('name');
  expect(isFormDirty).toBe(true);
  expect(name).toBe('Scenario Test');
});

test('handleChange changes correct piece of state', () => {
  const e = {
    target: {
      name: 'name',
      value: 'New scenario name',
    },
  };
  wrapper.instance().handleChange(e);
  const name = wrapper.state('name');
  expect(name).toBe('New scenario name');
});
