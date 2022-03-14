import React from 'react';
import { shallow } from 'enzyme';

import { ScenariosRow, MenuAction } from '../ScenariosRow';

const minProps = {
  index: 1,
  key: 1,
  scenario: {
    id: '1',
    name: 'Test scenario',
    createdBy: 'Ramon Barraza',
    status: 'OPENED_BY_SOMEONE_ELSE',
  },
  scenariostofilter: 'scenariosToday',
  id: 'tableToday',
  t: jest.fn(),
  openDeleteDialog: jest.fn(),
  openSaveAsTemplate: jest.fn(),
  handleOpenScenario: jest.fn(),
  handleGetInfo: jest.fn(),
  handleOpenViewOnly: jest.fn(),
};

const menuMinProps = {
  text: 'Get Info',
  icon: 'info',
  onClick: jest.fn(),
  scenario: {
    id: '1',
    name: 'Test scenario',
    createdBy: 'Ramon Barraza',
  },
};

const wrapper = shallow(<ScenariosRow {...minProps} />);
const menuWrapper = shallow(<MenuAction {...menuMinProps} />);

test('closeMenu function works correct', () => {
  wrapper.instance().closeMenu();
  const anchor = wrapper.state('anchorEl');
  expect(anchor).toBe(null);
});

test('openMenu function works correct', () => {
  const e = {
    currentTarget: jest.fn(),
  };

  wrapper.instance().openMenu(e);
  const anchor = wrapper.state('anchorEl');
  expect(anchor).toBe(e.currentTarget);
});

test('openDeleteDialog function works correct', () => {
  wrapper
    .instance()
    .openDeleteDialog(
      minProps.scenario,
      minProps.scenariostofilter,
      minProps.index
    );
  const anchor = wrapper.state('anchorEl');
  expect(anchor).toBe(null);
});

test('openEditDialog function works correct', () => {
  wrapper.instance().openEditDialog();
  const anchor = wrapper.state('anchorEl');
  expect(anchor).toBe(null);
});

test('saveAsTemplate function works correct', () => {
  wrapper.instance().saveAsTemplate(minProps.scenario);
  const anchor = wrapper.state('anchorEl');
  expect(anchor).toBe(null);
});

test('MenuAction component renders correct', () => {
  expect(menuWrapper).toMatchSnapshot();
});
