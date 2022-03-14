import React from 'react';
import { shallow } from 'enzyme';

import ScenariosTable from '../ScenarioTable';

const minProps = {
  scenarios: [
    { id: '1', name: 'Scenario 1' },
    { id: '2', name: 'Scenario 2' },
    { id: '3', name: 'Scenario 3' },
  ],
  scenariostofilter: 'scenariosToday',
  id: 'tableToday',
  t: jest.fn(),
  openDeleteDialog: jest.fn(),
  openSaveAsTemplate: jest.fn(),
  handleOpenScenario: jest.fn(),
  handleGetInfo: jest.fn(),
  handleOpenViewOnly: jest.fn(),
  needHeader: false,
  style: {},
  scenarioHeader: 'Today',
};

const wrapper = shallow(<ScenariosTable {...minProps} />);

test('ScenarioTable component renders without crashing', () => {
  expect(wrapper).toMatchSnapshot();
});
