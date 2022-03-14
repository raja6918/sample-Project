import React from 'react';
import { shallow } from 'enzyme';
import { AlertList } from '../AlertList';
import { alerts } from '../mockData';

describe('Test AlertList Component', () => {
  const minProps = {
    t: jest.fn(),
    alerts: alerts[115].alerts.warningAlerts,
    alertType: alerts[115].alertLevel,
    onAlertSelect: jest.fn(),
    onAlertClear: jest.fn(),
    openRuleEditDialog: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<AlertList {...minProps} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test('AlertList Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Check whether onAlertSelect is called with correct parameter on mouse enter', () => {
    wrapper
      .find('AlertList__AlertRow')
      .at(0)
      .simulate('mouseenter');
    expect(minProps.onAlertSelect).toBeCalledWith(minProps.alertType, 7951);
  });

  test('Check whether onAlertClear is called  on mouse leave', () => {
    wrapper
      .find('AlertList__AlertRow')
      .at(0)
      .simulate('mouseleave');
    expect(minProps.onAlertClear).toBeCalled();
  });

  test('Check whether openRuleEditDialog is called with correct parameter on clicking rule name label', () => {
    wrapper
      .find('.alert-rule-name')
      .at(0)
      .simulate('click');
    expect(minProps.openRuleEditDialog).toBeCalledWith(minProps.alerts[0].rule);
  });

  test('Check whether openRuleEditDialog is called with correct parameter on clicking edit rule btn', () => {
    wrapper.find(`#edit-rule-btn-${minProps.alertType}-1`).simulate('click');
    expect(minProps.openRuleEditDialog).toBeCalledWith(minProps.alerts[1].rule);
  });
});
