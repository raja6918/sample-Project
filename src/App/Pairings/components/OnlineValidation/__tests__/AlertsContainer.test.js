import React from 'react';
import { shallow } from 'enzyme';
import { AlertsContainer } from '../AlertsContainer';
import { alerts } from '../mockData';

describe('Test AlertsContainer Component', () => {
  const minProps = {
    t: jest.fn(),
    pairing: {
      name: 'Test',
      alerts: alerts[74].alerts,
    },
    open: true,
    openItemId: 1,
    handleCancel: jest.fn(),
    reportError: jest.fn(),
    clearErrorNotification: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<AlertsContainer {...minProps} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test('AlertsContainer Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Check whether onAlertSelect props is called', () => {
    wrapper.setState({ alertSelected: null });

    wrapper
      .find('Connect(AlertList)')
      .at(0)
      .prop('onAlertSelect')('error', 7951);

    expect(wrapper.state('alertSelected')).toEqual({
      alertType: 'error',
      flightNumber: 7951,
    });
  });

  test('Check whether onAlertClear props is called', () => {
    wrapper.setState({
      alertSelected: {
        alertType: 'error',
        flightNumber: 7951,
      },
    });

    wrapper
      .find('Connect(AlertList)')
      .at(0)
      .prop('onAlertClear')();

    expect(wrapper.state('alertSelected')).toBe(null);
  });

  test('Check whether openRuleEditDialog props is called', () => {
    wrapper.setState({ ruleSelected: null });

    wrapper
      .find('Connect(AlertList)')
      .at(0)
      .prop('openRuleEditDialog')('Test');

    expect(wrapper.state('ruleSelected')).toBe('Test');
  });
});
