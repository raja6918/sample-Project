import React from 'react';
import { shallow } from 'enzyme';

import { Rules } from '../Rules';

import * as ruleService from '../../../../../services/Data/rules';
import { ruleDescriptionData, rulesData, ruleSets } from '../mockData';

const props = {
  t: msg => msg,
  editMode: false,
  openItemId: '1',
  openItemName: 'Scenario test',
  reportError: jest.fn(),
  userData: { id: 1 },
};

const data = {
  code: ruleDescriptionData[0].code,
  ruleset: ruleDescriptionData[0].ruleset,
};

let wrapper;
beforeAll(() => {
  wrapper = shallow(<Rules {...props} />);
});

test('Rules component render correct', () => {
  expect(wrapper).toMatchSnapshot();
});

test('check whether reportError is called when an error occured in getRuleDescription', async () => {
  ruleService.getRuleDescription = jest.fn(() =>
    // eslint-disable-next-line prefer-promise-reject-errors
    Promise.reject({
      response: {},
    })
  );

  await wrapper.instance().fetchDescription(data);

  expect(props.reportError).toHaveBeenCalled();
});

test('check whether ruleDescriptions is set when getRuleDescription service resolved is successfully', async () => {
  expect(wrapper.state('ruleDescriptions')).toEqual([]);

  ruleService.getRuleDescription = jest.fn(() =>
    Promise.resolve(ruleDescriptionData[0])
  );

  await wrapper.instance().fetchDescription(data);

  expect(wrapper.state('ruleDescriptions')).toEqual([ruleDescriptionData[0]]);
});

test('check whether ruleDescriptions is reset and rules and currentRuleSetId is set when ruleset change is successfull', async () => {
  wrapper.setState({ ruleDescriptions: [ruleDescriptionData[0]] });

  ruleService.getRules = jest.fn(() => Promise.resolve({ data: rulesData }));

  await wrapper.instance().onChangeRuleSet({
    target: {
      value: 1,
    },
  });

  expect(wrapper.state('ruleDescriptions')).toEqual([]);
  expect(wrapper.state('rules')).toEqual(rulesData);
  expect(wrapper.state('currentRuleSetId')).toBe(1);
});

test("check whether rule's state change when activateRule service resolved successfully", async () => {
  wrapper.setState({ rules: rulesData });

  ruleService.activateRule = jest.fn(() => Promise.resolve());

  await wrapper.instance().handleStateChange(true, rulesData[0]);

  expect(wrapper.state('rules')[0].active).toBe(true);
  expect(wrapper.state('rules')[0].activeDefinedInCurrent).toBe(true);
});

test('check whether reportError is called when an error occured in activateRule service', async () => {
  ruleService.activateRule = jest.fn(() =>
    // eslint-disable-next-line prefer-promise-reject-errors
    Promise.reject({
      response: {},
    })
  );

  await wrapper.instance().handleStateChange(true, rulesData[1]);

  expect(props.reportError).toHaveBeenCalled();
});

test("check whether rule's state reverted when revertRule service resolved successfully", async () => {
  wrapper.setState({ rules: rulesData });

  ruleService.revertRule = jest.fn(() => Promise.resolve());
  ruleService.getRuleDescription = jest.fn(() =>
    Promise.resolve(ruleDescriptionData[1])
  );

  await wrapper.instance().handleStateReset(rulesData[1]);

  expect(wrapper.state('rules')[1].active).toBe(false);
  expect(wrapper.state('rules')[1].activeDefinedInCurrent).toBe(false);
});

test('check whether reportError is called when an error occured in revertRule service', async () => {
  ruleService.revertRule = jest.fn(() =>
    // eslint-disable-next-line prefer-promise-reject-errors
    Promise.reject({
      response: {},
    })
  );

  await wrapper.instance().handleStateReset(rulesData[1]);

  expect(props.reportError).toHaveBeenCalled();
});

test("check whether rule's parameter change when handleParamSet is called", async () => {
  wrapper.setState({
    rules: rulesData,
    ruleSets: ruleSets,
    currentRuleSetId: ruleSets[2].id,
    ruleDescriptions: [ruleDescriptionData[0]],
  });

  const data =
    ruleDescriptionData[0].userDescription.references[
      'SierraCiesApplyAllowDeadheadDuty0'
    ];
  const code = ruleDescriptionData[0].code;

  await wrapper.instance().handleParamSet('false', data, code);

  expect(
    wrapper.state('ruleDescriptions')[0].userDescription.references[
      'SierraCiesApplyAllowDeadheadDuty0'
    ].value
  ).toBe('false');
});

test("check whether rule's parameter reverted when revertParam service resolved successfully", async () => {
  wrapper.setState({
    rules: rulesData,
    ruleDescriptions: [ruleDescriptionData[0]],
  });

  ruleService.revertParam = jest.fn(() => Promise.resolve());
  ruleService.getRuleDescription = jest.fn(() =>
    Promise.resolve(ruleDescriptionData[0])
  );

  const data = ruleDescriptionData[0].userDescription[1];
  const code = ruleDescriptionData[0].code;
  const ruleset = ruleDescriptionData[0].ruleset;
  await wrapper.instance().handleParamReset(data, ruleset, code);

  expect(wrapper.state('rules')[0]).toEqual(rulesData[0]);
  expect(wrapper.state('ruleDescriptions')).toEqual([ruleDescriptionData[0]]);
});

test('check whether reportError is called when an error occured in revertParam service', async () => {
  ruleService.revertParam = jest.fn(() =>
    // eslint-disable-next-line prefer-promise-reject-errors
    Promise.reject({
      response: {},
    })
  );

  const data = ruleDescriptionData[0].userDescription[1];
  const code = ruleDescriptionData[0].code;
  const ruleset = ruleDescriptionData[0].ruleset;
  await wrapper.instance().handleParamReset(data, ruleset, code);

  expect(props.reportError).toHaveBeenCalled();
});

let readOnlyWrapper;
test('Rules component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<Rules {...props} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});

test('Check whether state combo box is disabled in readOnly mode', () => {
  expect(readOnlyWrapper.instance().handleDisable('', {})).toBe(true);
});

test('Check whether state reset button is disabled in readOnly mode', () => {
  expect(readOnlyWrapper.instance().handleStateTooltipDisable('', {})).toBe(
    true
  );
});
