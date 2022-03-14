import React from 'react';
import { mount, shallow } from 'enzyme';

import { AircraftTypes } from '../AircraftTypes';
import * as aircraftTypesService from '../../../../../services/Data/aircraftTypes';
import { getHeaders } from '../Constants';

const aircrafts = [
  {
    id: 10,
    code: '320',
    modelCode: '320',
    name: 'Airbus A320-100',
    restFacility: 'None',
    restFacilityCode: 'NONE',
  },
  {
    id: 9,
    code: '319',
    modelCode: '319',
    name: 'Airbus A319-100',
    restFacility: 'None',
    restFacilityCode: 'NONE',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  clearErrorNotification: jest.fn().mockImplementation(() => null),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  reportError: jest.fn(),
  openDeleteDialog: jest.fn(),
  deleteDialogItem: aircrafts[0],
  closeDeleteDialog: jest.fn(),
};
const aircraft = {
  id: 10,
  modelId: 10,
  name: 'Aircraft Test',
  restFacilityId: 10,
  type: 'TEST',
  crewComposition: [
    {
      id: 1,
      quantity: 1,
    },
    {
      id: 2,
      quantity: 1,
    },
    {
      id: 5,
      quantity: 1,
    },
    {
      id: 12,
      quantity: 1,
    },
  ],
};

const wrapper = mount(<AircraftTypes {...minProps} />);

test('Regions Component renders', () => {
  wrapper.instance().componentDidMount();
  expect(wrapper).toMatchSnapshot();
});

test('getHeaders returns the right columns', () => {
  const columns = getHeaders(jest.fn());
  expect(columns.length).toBe(5);
});

/*
  Next test isn't valid anymore because createAircraft function was removed.
  Help needed here.
*/
test.skip('createAircraft works correct', () => {
  const aircraft = {
    type: 'A19N',
    modelId: 1,
    name: 'Airbus A319 neo',
    restFacilityId: 'CODE',
    crewComposition: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
  };

  const models = [{ id: 1, code: '319' }];
  const positions = [
    { name: 'Flight Deck', positions: [{ id: 1, code: 'CPT' }] },
    { name: 'Cabin', positions: [{ id: 2, code: 'CM' }] },
  ];
  const restFacilities = [{ id: 1, name: 'C1-Bunk', code: 'CODE' }];

  const newAircraft = wrapper
    .instance()
    .createAircraft(aircraft, models, positions, restFacilities);

  expect(newAircraft.model).toBe('319');
  expect(newAircraft.restFacility).toBe('C1-Bunk');
  expect(newAircraft.standardComplement).toBe('2 CPT, 1 CM');
});

test('addAircraft function works', () => {
  wrapper.instance().addAircraft(aircraft);
});

test('onClearSnackBar function works', () => {
  wrapper.instance().onClearSnackBar();
  expect(wrapper.state('message')).toEqual(null);
  expect(wrapper.state('snackBarType')).toEqual('');
});

test('toggleForm function works', () => {
  wrapper.instance().toggleForm();
  expect(wrapper.state('isFormOpen')).toEqual(true);
  wrapper.instance().toggleForm();
  expect(wrapper.state('isFormOpen')).toEqual(false);
});

const shallowWrapper = shallow(<AircraftTypes {...minProps} />);

test('deleteAircraft method should remove aircraft properly if deleteAircraft service resolved', async () => {
  shallowWrapper.setState({ aircrafts, fetching: false });
  shallowWrapper.update();

  aircraftTypesService.deleteAircraft = jest.fn(() => Promise.resolve());

  await shallowWrapper.instance().deleteAircraft(aircrafts[0]);
  expect(shallowWrapper.state().aircrafts.length).toBe(1);
  expect(shallowWrapper.state().aircrafts[0]).toEqual(aircrafts[1]);

  aircraftTypesService.deleteAircraft.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  shallowWrapper.setState({ aircrafts, fetching: false });
  shallowWrapper.update();
  shallowWrapper.instance().deleteAircraft = jest.fn();

  // check whether delete icon click in generic table worked properly
  shallowWrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(aircrafts[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(aircrafts[0]);

  //check whether delete button click in DeleteDialog worked properly
  shallowWrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(shallowWrapper.instance().deleteAircraft).toHaveBeenCalledWith(
    aircrafts[0]
  );

  shallowWrapper.instance().deleteAircraft.mockClear();
});

let readOnlyWrapper;
test('Aircraft Type component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<AircraftTypes {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
