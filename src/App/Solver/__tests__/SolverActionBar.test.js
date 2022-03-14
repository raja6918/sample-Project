import React from 'react';
import { shallow } from 'enzyme';

import { SolverActionBar } from '../SolverActionBar';

import * as utils from '../utils';
import * as solverService from '../../../services/Solver/index';

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
  status: {
    statusId: 9,
    status: 'failed',
    textBar: `failed.textBar`,
    label: `failed.label`,
    icon: 'failed_icon',
    activeBtns: ['play'],
    routes: [1, 2],
    showTimer: true,
    dateCurrent: true,
    timerType: 'elapsed',
    block: false,
  },
  crewGroupName: 'CG Name', //Same as Id
  lastModified: '2020-03-30T21:45:11.219Z',
  elapsedTime: '00:00:00',
};

const minProps = {
  t: jest.fn(),
  onEndorse: jest.fn(),
  onUpdateState: jest.fn(),
  readOnly: false,
  reportError: jest.fn(),
  solverScopes: {
    solverManage: ['solver_manage'],
  },
};

const wrapper = shallow(
  <SolverActionBar activeRequest={activeRequest} {...minProps} />
);

test('SolverActionBar Component renders', () => {
  expect(wrapper).toMatchSnapshot();
});

test('openInNewTab is called getPreviewId service is successfull', async () => {
  utils.openInNewTab = jest.fn();
  utils.getFilteredCrewBasesandRules = jest.fn(() => {
    return [[], []];
  });
  utils.getBrowserSessionId = jest.fn(() => Promise.resolve(123456));
  solverService.getPreviewId = jest.fn(() => Promise.resolve(10000));

  await wrapper.instance().onPreview();

  expect(utils.openInNewTab).toHaveBeenCalled();
  expect(wrapper.state('isFetching')).toBe(false);
});

test('reportError is called getPreviewId service return error', async () => {
  utils.openInNewTab = jest.fn();
  utils.getFilteredCrewBasesandRules = jest.fn(() => {
    return [[], []];
  });
  utils.getBrowserSessionId = jest.fn(() => Promise.resolve(123456));
  const error = {
    response: {},
  };
  solverService.getPreviewId = jest.fn(() => Promise.reject(error));

  await wrapper.instance().onPreview();

  expect(minProps.reportError).toHaveBeenCalled();
  expect(wrapper.state('isFetching')).toBe(false);
});

test('Preview button must call onPreview method', () => {
  wrapper.instance().onPreview = jest.fn();
  wrapper.instance().forceUpdate();

  wrapper
    .find('Connect(AccessEnabler)')
    .at(3)
    .renderProp('render')({ disableComponent: false })
    .find('ActionButton')
    .at(0)
    .simulate('click');

  expect(wrapper.instance().onPreview).toHaveBeenCalled();

  wrapper.instance().onPreview.mockClear();
  wrapper.instance().forceUpdate();
});
