import React from 'react';
import { mount, shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import PairingsHeaderDefault, { PairingsHeader } from '../PairingsHeader';
import * as ruleService from '../../../services/Data/rules';

const testMock = () => {
  return 'test';
};

const props = {
  name: 'Pairings',
  onAddClick: jest.fn(),
  onFilterClick: jest.fn(),
  onMoreClick: jest.fn(),
  openItemName: 'Test 0001',
  t: testMock,
  date: {
    startDate: '01-06-2020',
    endDate: '31-06-2020',
  },
  ruleSets: [{ id: 1, name: 'base9-apply-bcd-10' }],
  crewGroups: [{ id: 1, name: '320 pilots', ruleset: 1 }],
  handleCrewGroupChange: jest.fn(),
};

const wrapper = shallow(<PairingsHeader {...props} />);

test('Pairings Component renders', () => {
  expect(
    mount(
      <Router>
        <PairingsHeaderDefault {...props} />
      </Router>
    )
  ).toMatchSnapshot();
});

test('check whether setRuleBasedonCrewGroup method is triggered', () => {
  wrapper.instance().setRuleBasedOnCrewGroup = jest.fn();

  wrapper.instance().forceUpdate();

  wrapper.find('#context').prop('onChange')(1);

  expect(wrapper.instance().setRuleBasedOnCrewGroup).toHaveBeenCalledWith(1);

  wrapper.instance().setRuleBasedOnCrewGroup.mockClear();
});

test('check whether handleCrewGroupChange is called if updateCrewGroup is successfull ', async () => {
  ruleService.updateCrewGroup = jest.fn(() => Promise.resolve());

  await wrapper.instance().updateCrewGroup();

  expect(props.handleCrewGroupChange).toHaveBeenCalled();
});
