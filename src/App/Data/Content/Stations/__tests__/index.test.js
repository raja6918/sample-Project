import React from 'react';
import { shallow } from 'enzyme';

import { Stations } from '../Stations';

import API from '../../../../../utils/API';

import * as stationsService from '../../../../../services/Data/stations';

const stations = [
  {
    code: 'ATL',
    name: 'Atlanta Hartsfield-Jackson Intl Apt',
  },
  {
    code: 'AUA',
    name: 'Aruba',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  reportError: jest.fn(),
  openDeleteDialog: jest.fn(),
  deleteDialogItem: stations[0],
  closeDeleteDialog: jest.fn(),
  clearErrorNotification: jest.fn(),
  handleDeleteError: jest.fn(),
  deleteDialogIsOpen: false,
  exitDeleteDialog: jest.fn(),
};

const station = {
  code: 'VAB',
  name: 'Viva Aerobus',
  country: 'Mexico,MEX',
  region: 'AME',
  regionName: 'America',
  timeZone: '',
  latitude: 0.3,
  longitude: 0.5,
  dst: 120,
  dstStartDateTime: '2018-05-8T108:30:09.586Z',
  dstEndDateTime: '2018-05-18T08:30:00.586Z',
};
const wrapper = shallow(<Stations {...minProps} />);

test('Station Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    stations: [],
    message: null,
    selectedStation: null,
    fetching: true,
    isFormOpen: false,
  });

  API.get('/stations/').then(station => {
    wrapper.update();
    expect(wrapper.state('stations')).toEqual(expect.arrayContaining(station));

    API.put('/stations/1', station).then(() => {
      wrapper.update();
      expect(
        wrapper
          .state('stations')
          .length()
          .toBe(length)
      );
    });

    API.delete('/stations/[2]').then(() => {
      wrapper.update();
      expect(
        wrapper
          .state('station')
          .length()
          .toBe(length - 1)
      );
    });
  });
});

test.skip('open and close dialogs and forms.', () => {
  wrapper.instance().openDeleteDialog(station);
  expect(wrapper.state('selectedStation')).toMatchObject(station);

  wrapper.instance().closeDeleteDialog();
  expect(wrapper.state('deleteDialogIsOpen')).toBe(false);

  wrapper.instance().handleEditItem(station);
  expect(wrapper.state('selectedStation')).toMatchObject(station);
  expect(wrapper.state('isFormOpen')).toBe(true);

  wrapper.instance().toggleForm();
  expect(wrapper.state('selectedStation')).toBe(null);
  expect(wrapper.state('isFormOpen')).toBe(false);
});

test('addStation function works', () => {
  wrapper.instance().addStation(station);
});

test('deleteStation method should remove station properly if deleteStation service is resolved', async () => {
  wrapper.setState({ stations, fetching: false });
  wrapper.update();

  stationsService.deleteStation = jest.fn(() => Promise.resolve());

  await wrapper.instance().deleteStation(stations[0]);
  expect(wrapper.state().stations.length).toBe(1);
  expect(wrapper.state().stations[0]).toEqual(stations[1]);

  stationsService.deleteStation.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  wrapper.setState({ stations, fetching: false });
  wrapper.update();
  wrapper.instance().deleteStation = jest.fn();

  // check whether delete icon click in generic table worked properly
  wrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(stations[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(stations[0]);

  //check whether delete button click in DeleteDialog worked properly
  wrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(wrapper.instance().deleteStation).toHaveBeenCalledWith(stations[0]);

  wrapper.instance().deleteStation.mockClear();
});
