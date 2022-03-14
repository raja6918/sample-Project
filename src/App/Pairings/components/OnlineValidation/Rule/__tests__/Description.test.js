import React from 'react';
import { shallow } from 'enzyme';
import { Description } from '../Description';
import { ruleDescriptionData } from '../../../../../Data/Content/Rules/mockData';
import * as ruleService from '../../../../../../services/Data/rules';

describe('Test Pairing Alerts Rule Description Component', () => {
  const minProps = {
    t: jest.fn(msg => msg),
    handleParamSet: jest.fn(),
    handleParamReset: jest.fn(),
    setOverlay: jest.fn(),
    removeOverlay: jest.fn(),
    reportError: jest.fn(),
    toggleLoader: jest.fn(),
    handleRemoveParamSet: jest.fn(),
  };

  test('Description Component renders text correctly', () => {
    const wrapper = shallow(
      <Description
        code={ruleDescriptionData[0].code}
        data={ruleDescriptionData[0].userDescription[2]}
        {...minProps}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('Description Component renders HyperLink correctly', () => {
    const data = ruleDescriptionData[0].userDescription[1];
    const wrapper = shallow(
      <Description
        code={ruleDescriptionData[0].code}
        data={data}
        ruleSet={ruleDescriptionData[0].ruleset}
        {...minProps}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test.skip('GenericTextField Component render and work correctly', () => {
    const code = ruleDescriptionData[0].code;
    const data = ruleDescriptionData[0].userDescription[0];
    const wrapper = shallow(
      <Description
        code={code}
        data={data}
        ruleSet={ruleDescriptionData[0].ruleset}
        overlay={true}
        {...minProps}
      />
    );
    expect(wrapper).toMatchSnapshot();

    // Check whether component call handleOnchange when onChange is triggered
    wrapper.instance().handleOnchange = jest.fn();
    wrapper.instance().forceUpdate();
    wrapper.find('GenericTextField').prop('onChange')(data.value, data);
    expect(wrapper.instance().handleOnchange).toBeCalledWith(data.value, data);

    // Check whether component call handleParamReset props when handleReset is triggered
    wrapper.find('GenericTextField').prop('handleReset')(data);
    expect(minProps.handleParamReset).toBeCalledWith(
      data,
      ruleDescriptionData[0].ruleset,
      code
    );

    // Check whether component call removeOverlay props when removeOverlay is triggered
    wrapper.find('GenericTextField').prop('removeOverlay')();
    expect(minProps.removeOverlay).toBeCalledWith();
  });

  test.skip('Check whether snackMessage set to null when onClearSnackBar method triggered', async () => {
    const code = ruleDescriptionData[0].code;
    const data = ruleDescriptionData[0].userDescription[0];
    const wrapper = shallow(
      <Description
        code={code}
        data={data}
        ruleSet={ruleDescriptionData[0].ruleset}
        overlay={false}
        {...minProps}
      />
    );

    wrapper.setState({ snackMessage: 'Test message' });
    wrapper.find('Notification').prop('clear')();
    expect(wrapper.state('snackMessage')).toBe(null);
  });

  test.skip('GenericTimeField Component render and work correctly', async () => {
    const code = ruleDescriptionData[1].code;
    const data = ruleDescriptionData[1].userDescription[1];
    const wrapper = shallow(
      <Description
        code={code}
        data={data}
        ruleSet={ruleDescriptionData[0].ruleset}
        overlay={false}
        {...minProps}
      />
    );
    expect(wrapper).toMatchSnapshot();

    // Check whether component call handleOnchange when onChange is triggered
    wrapper.instance().handleOnchange = jest.fn();
    wrapper.instance().forceUpdate();
    wrapper.find('GenericTimeField').prop('onChange')(data.value, data);
    expect(wrapper.instance().handleOnchange).toBeCalledWith(data.value, data);

    // Check whether component call handleParamReset props when handleReset is triggered
    wrapper.find('GenericTimeField').prop('handleReset')(data);
    expect(minProps.handleParamReset).toBeCalledWith(
      data,
      ruleDescriptionData[0].ruleset,
      code
    );

    // Check whether component call removeOverlay props when removeOverlay is triggered
    wrapper.find('GenericTimeField').prop('removeOverlay')();
    expect(minProps.removeOverlay).toBeCalledWith();
  });

  test.skip('GenericDateField Component render and work correctly', async () => {
    const code = ruleDescriptionData[7].code;
    const data = ruleDescriptionData[7].userDescription[1];
    const wrapper = shallow(
      <Description
        code={code}
        data={data}
        ruleSet={ruleDescriptionData[0].ruleset}
        overlay={true}
        {...minProps}
      />
    );
    expect(wrapper).toMatchSnapshot();

    // Check whether component call handleOnchange when onChange is triggered
    wrapper.instance().handleOnchange = jest.fn();
    wrapper.instance().forceUpdate();
    wrapper.find('GenericDateField').prop('onChange')(data.value, data);
    expect(wrapper.instance().handleOnchange).toBeCalledWith(data.value, data);

    // Check whether component call handleParamReset props when handleReset is triggered
    wrapper.find('GenericDateField').prop('handleReset')(data);
    expect(minProps.handleParamReset).toBeCalledWith(
      data,
      ruleDescriptionData[0].ruleset,
      code
    );

    // Check whether component call removeOverlay props when removeOverlay is triggered
    wrapper.find('GenericDateField').prop('removeOverlay')();
    expect(minProps.removeOverlay).toBeCalledWith();
  });

  test.skip('SelectInput Component render and work correctly', async () => {
    const code = ruleDescriptionData[3].code;
    const data = ruleDescriptionData[3].userDescription[1];
    const wrapper = shallow(
      <Description
        code={code}
        data={data}
        ruleSet={ruleDescriptionData[0].ruleset}
        overlay={true}
        {...minProps}
      />
    );
    expect(wrapper).toMatchSnapshot();

    // Check whether component call handleOnchange when onChange is triggered
    wrapper.instance().handleOnchange = jest.fn();
    wrapper.instance().forceUpdate();
    wrapper.find('SelectInput').prop('onChange')(data.value, data);
    expect(wrapper.instance().handleOnchange).toBeCalledWith(data.value, data);

    // Check whether component call handleParamReset props when handleReset is triggered
    wrapper.find('SelectInput').prop('handleReset')(data);
    expect(minProps.handleParamReset).toBeCalledWith(
      data,
      ruleDescriptionData[0].ruleset,
      code
    );

    // Check whether component call removeOverlay props when removeOverlay is triggered
    wrapper.find('SelectInput').prop('removeOverlay')();
    expect(minProps.removeOverlay).toBeCalledWith();
  });

  test.skip('check whether local validation is triggered when invalid data is passed in handleOnchange', async () => {
    const data = ruleDescriptionData[1].userDescription[1];
    const wrapper = shallow(
      <Description
        t={msg => msg}
        code={ruleDescriptionData[0].code}
        data={ruleDescriptionData[1].userDescription[1]}
        overlay={false}
        {...minProps}
      />
    );

    await wrapper.instance().handleOnchange('05:00', data);

    expect(wrapper.state('error')).toBe(true);
    expect(wrapper.state('snackMessage')).toBe(
      'ERRORS.RULES_DESCRIPTION.Time.rangeValidation'
    );
  });

  test.skip('check whether reportError is called when error occured in setParam Service', async () => {
    const data = ruleDescriptionData[3].userDescription[1];
    const wrapper = shallow(
      <Description
        code={ruleDescriptionData[0].code}
        data={ruleDescriptionData[0].userDescription[2]}
        overlay={false}
        {...minProps}
      />
    );

    ruleService.setParam = jest.fn(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        response: {},
      })
    );

    await wrapper.instance().handleOnchange(data.value, data);

    expect(minProps.reportError).toHaveBeenCalled();
  });
});
