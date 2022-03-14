import React from 'react';
import { shallow } from 'enzyme';

import { CrewGroups } from '../CrewGroups';
import * as crewGroupService from '../../../../../services/Data/crewGroups';

const crewGroups = [
  {
    id: 2,
    name: '320 CM/FA',
    ruleset: 1,
    aircraftTypeCodes: ['321'],
    airlineCodes: ['AO', 'AR'],
    positionCodes: ['CPT', 'FO'],
    rulesetDisplayName: 'base9-apply-bcd-10',
  },
  {
    id: 1,
    name: '320 pilots',
    ruleset: 1,
    aircraftTypeCodes: ['321'],
    airlineCodes: ['AO'],
    positionCodes: ['CPT', 'FO'],
    rulesetDisplayName: 'base9-apply-bcd-10',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: crewGroups[0],
  closeDeleteDialog: jest.fn(),
};

const wrapper = shallow(<CrewGroups {...minProps} />);
test('CrewGroups Component renders', () => {
  // Initially render loading component
  expect(wrapper).toMatchSnapshot();

  wrapper.setState({ crewGroups, fetching: false });
  wrapper.update();

  // After fetching is completed rest of components is rendered
  expect(wrapper).toMatchSnapshot();
});

test('deleteCrewGroup method should remove crew group properly if deleteCrewGroup service is resolved', async () => {
  wrapper.setState({ crewGroups, fetching: false });
  wrapper.update();

  crewGroupService.deleteCrewGroup = jest.fn(() => Promise.resolve());

  await wrapper.instance().deleteCrewGroup(crewGroups[0]);
  expect(wrapper.state().crewGroups.length).toBe(1);
  expect(wrapper.state().crewGroups[0]).toEqual(crewGroups[1]);

  crewGroupService.deleteCrewGroup.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  wrapper.setState({ crewGroups, fetching: false });
  wrapper.update();
  wrapper.instance().deleteCrewGroup = jest.fn();

  // check whether delete icon click in generic table worked properly
  wrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(crewGroups[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(crewGroups[0]);

  //check whether delete button click in DeleteDialog worked properly
  wrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(wrapper.instance().deleteCrewGroup).toHaveBeenCalledWith(
    crewGroups[0]
  );

  wrapper.instance().deleteCrewGroup.mockClear();
});

let readOnlyWrapper;
test('Crewgroups component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<CrewGroups {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
