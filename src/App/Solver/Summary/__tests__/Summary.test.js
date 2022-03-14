import React from 'react';
import { shallow } from 'enzyme';

import Summary from '../index';

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
  t: jest.fn(),
  readOnly: false,
};
test('Summary Component renders', () => {
  expect(
    shallow(<Summary activeRequest={activeRequest} {...minProps} />)
  ).toMatchSnapshot();
});
