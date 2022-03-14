import React from 'react';
import { shallow } from 'enzyme';

import { CrewBases } from '../CrewBases';
import * as crewBaseService from '../../../../../services/Data/crewBases';

const crewBases = [
  {
    code: 'LND',
    name: 'London',
    countryCode: 'GB',
    stationCodes: ['LHR', 'LGW'],
    id: 4,
    countryDisplayName: 'United Kingdom, GB',
  },
  {
    code: 'MTL',
    name: 'Montreal',
    countryCode: 'CA',
    stationCodes: ['YUL'],
    id: 2,
    countryDisplayName: 'Canada, CA',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  clearErrorNotification: jest.fn().mockImplementation(() => null),
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: crewBases[0],
  closeDeleteDialog: jest.fn(),
};

const crewBase = {
  stations: [
    {
      code: 'MX',
      name: 'Mexico',
    },
    {
      code: 'TST',
      name: 'Test Name',
    },
  ],
  countryCode: 'MX',
  countryName: 'Mexico',
  name: 'Station TEST',
};

const wrapper = shallow(<CrewBases {...minProps} />);
test('CrewBases Component renders', () => {
  expect(shallow(<CrewBases {...minProps} />)).toMatchSnapshot();
});

test('Countries Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    fetching: true,
    crewBases: [],
    selectedCrewBase: null,
    isFormOpen: false,
    message: null,
    snackType: '',
  });
});

test('addCountry function works', () => {
  wrapper.instance().addCrewBase(crewBase);
});

test('toggleForm function updates states properly', () => {
  wrapper.setState({ isFormOpen: true, selectedCrewBase: [] });
  wrapper.instance().toggleForm();
  expect(wrapper.state().isFormOpen).toEqual(false);
  expect(wrapper.state().selectedCrewBase).toEqual(null);
  wrapper.setState({ isFormOpen: false, selectedCrewBase: null });
  wrapper.instance().toggleForm();
  expect(wrapper.state().isFormOpen).toEqual(true);
});

test('onClearSnackBar function updates states properly', () => {
  wrapper.instance().onClearSnackBar();

  expect(wrapper.state().message).toEqual(null);
  expect(wrapper.state().snackBarType).toEqual('');
});

test('deleteCrewBase method should remove crew base properly if deleteCrewBases service is resolved', async () => {
  wrapper.setState({ crewBases, fetching: false });
  wrapper.update();

  crewBaseService.deleteCrewBases = jest.fn(() => Promise.resolve());

  await wrapper.instance().deleteCrewBase(crewBases[0]);
  expect(wrapper.state().crewBases.length).toBe(1);
  expect(wrapper.state().crewBases[0]).toEqual(crewBases[1]);

  crewBaseService.deleteCrewBases.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  wrapper.setState({ crewBases, fetching: false });
  wrapper.update();
  wrapper.instance().deleteCrewBase = jest.fn();

  // check whether delete icon click in generic table worked properly
  wrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(crewBases[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(crewBases[0]);

  //check whether delete button click in DeleteDialog worked properly
  wrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(wrapper.instance().deleteCrewBase).toHaveBeenCalledWith(crewBases[0]);

  wrapper.instance().deleteCrewBase.mockClear();
});

let readOnlyWrapper;
test('Crew Base component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<CrewBases {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
