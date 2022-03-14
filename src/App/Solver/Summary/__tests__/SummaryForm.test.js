import React from 'react';
import { shallow } from 'enzyme';

import { SummaryForm } from '../SummaryForm';

import API from '../../../../utils/API';

const t = jest.fn();
const activeRequest = {
  id: 1,
  name: 'Draft Run: 888 Pilots',
  description: 'Description for Draft Run: 888 Pilots',
  crewGroupId: 1, //crewGroup
  solverTaskId: 1, //solverTask
  solverRecipeId: 1, //recipe
  rulesetId: 1, //rules
  isEndorsed: false,
  jobId: 0,
  solverScopeId: 1,
  status: 'idle', //idle, running, paused, success, failed
  crewGroupName: 'CG Name', //Same as Id
  lastModified: '2020-03-30T21:45:11.219Z',
  elapsedTime: '00:00:00',
};

const minProps = {
  updateEndorsed: false,
  setNewSolverRequests: jest.fn(),
  readOnly: false,
  solverTasks: [],
  crewGroups: [],
  rules: [],
  recipes: [],
  scopes: [],
  solverScopes: {
    solverManage: ['solver_manage'],
  },
};
const defaultValues = {
  // solverTask: 2,
  // crewGroup: 2,
  // startFrom: 2,
  // rules: 2,
  // recipe: 2,
  // scope: 2,
  // description: 'No Lorem',
  // crewComplements: 2,
  isEndorsed: '',
};

const wrapper = shallow(
  <SummaryForm t={t} activeRequest={activeRequest} {...minProps} />
);
test('SummaryForm Component renders', () => {
  expect(
    shallow(
      <SummaryForm t={t} activeRequest={activeRequest} {...minProps} />
    ).dive()
  ).toMatchSnapshot();
});

test.skip('SummaryForm Component gets default values', () => {
  API.get(`/solver-requests/summary/${activeRequest.id}`)
    .then(defaultValues => {
      wrapper.setState({
        defaultValues,
      });
      expect(wrapper.state('defaultValues')).toEqual(
        expect.arrayContaining(defaultValues)
      );
    })
    .catch(error => {
      console.error(error);
    });
});
test.skip('updateSolverSummary() works', () => {
  wrapper.setState({
    defaultValues,
  });
  wrapper.instance().updateSolverSummary('solverTask', 1);
  expect(wrapper.state().defaultValues.solverTask).toEqual(1);
});
test.skip('Function getPropertyValue in SummaryForm Component returns -1 for invalid properties', () => {
  expect(wrapper.instance().getPropertyValue('faveProperty')).toEqual(-1);
});

test('componentWillReceiveProps() updates state when selected prop changes', () => {
  activeRequest.id = '2';
  wrapper.setProps({ activeRequest: activeRequest });
  expect(wrapper.instance().props.activeRequest.id).toBe('2');
});

test.skip('updateSolverSummary() updates isEndorsed field', () => {
  wrapper
    .instance()
    .updateSolverSummary('isEndorsed', activeRequest.isEndorsed);
  expect(wrapper.instance().state.defaultValues.isEndorsed).toBe(true);
});
test.skip('updateSolverSummary() updates solverTask field', () => {
  wrapper.instance().updateSolverSummary('solverTask', 3);
  expect(wrapper.instance().state.defaultValues.solverTask).toBe(3);
});
