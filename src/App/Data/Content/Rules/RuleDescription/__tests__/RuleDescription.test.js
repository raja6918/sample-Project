import React from 'react';
import { shallow } from 'enzyme';
import { RuleDescription } from '../RuleDescription';
import { ruleDescriptionData, rulesData } from '../../mockData';

describe('Test Rule Description Component', () => {
  const minProps = {
    t: jest.fn(msg => msg),
    handleParamSet: jest.fn(),
    handleParamReset: jest.fn(),
    fetchDescription: jest.fn(),
    triggerResize: jest.fn(),
    clearErrorNotification: jest.fn(),
    code: 'CiesApplyAllowDeadheadDuty',
    ruleDescriptions: ruleDescriptionData,
    data: rulesData[0],
    scrollRefY: {
      clientHeight: 500,
      scrollTop: 0,
    },
    needToMoveUp: true,
    userId: 1,
    scenarioId: 1,
    readOnly: false,
    toggleLoader: jest.fn(),
    reportError: jest.fn(),
    isOpen: true,
    lastOpenedRowData: rulesData[0],
    refreshRules: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<RuleDescription {...minProps} />);
  });

  test('Rule Description Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Rule Description subSessions state and subsession renders correctly when handleLink is invoked', () => {
    wrapper
      .find('Description')
      .at(0)
      .prop('handleLink')({ code: minProps.code });

    expect(wrapper.state('subSessions')).toEqual([minProps.code]);
    expect(minProps.fetchDescription).toBeCalled();
    expect(minProps.triggerResize).toBeCalled();
    expect(wrapper).toMatchSnapshot();
  });

  test('Rule Description subSessions state reset and subsession renders correctly when handleClose is invoked', () => {
    wrapper.find({ 'aria-label': 'close row' }).prop('onClick')();

    expect(wrapper.state('subSessions')).toEqual([]);
    expect(minProps.triggerResize).toBeCalled();
    expect(wrapper).toMatchSnapshot();
  });

  test('Rule Description overlay state is set to true and render correctly when setOverlay is invoked', () => {
    wrapper
      .find('Description')
      .at(0)
      .prop('setOverlay')();

    expect(wrapper.state('overlay')).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  test('Rule Description overlay state is set to false and render correctly when removeOverlay is invoked', () => {
    wrapper
      .find('Description')
      .at(0)
      .prop('removeOverlay')();

    expect(wrapper.state('overlay')).toBe(false);
    expect(minProps.clearErrorNotification).toBeCalled();
    expect(wrapper).toMatchSnapshot();
  });

  test('handleParamSet prop is called with correct paramaters when handleParamSet is invoked', () => {
    wrapper
      .find('Description')
      .at(0)
      .prop('handleParamSet')(
      ruleDescriptionData[0].userDescription.references[0].value,
      ruleDescriptionData[0].userDescription,
      rulesData[0].code
    );

    expect(minProps.handleParamSet).toBeCalledWith(
      ruleDescriptionData[0].userDescription.references[0].value,
      ruleDescriptionData[0].userDescription,
      rulesData[0].code
    );
  });

  test('handleParamReset prop is called with correct paramaters when handleParamReset is invoked', () => {
    wrapper
      .find('Description')
      .at(0)
      .prop('handleParamReset')(ruleDescriptionData[0].userDescription);

    expect(minProps.handleParamReset).toBeCalledWith(
      ruleDescriptionData[0].userDescription
    );
  });

  test('Check whether reportError prop is called', () => {
    wrapper
      .find('Description')
      .at(0)
      .prop('reportError')({ error: 'some error' });

    expect(minProps.reportError).toBeCalledWith({
      error: { error: 'some error' },
    });
  });
});
