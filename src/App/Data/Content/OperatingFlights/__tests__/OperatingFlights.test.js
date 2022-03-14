import React from 'react';
import { shallow, mount } from 'enzyme';

import OperatingFlightsDefault, { OperatingFlights } from '../OperatingFlights';
import { getHeaders } from '../constants';
import * as flightsService from '../../../../../services/Data/operatingFlights';
import AccessEnabler from '../../../../../components/AccessEnabler';

const flightsData = [
  {
    id: 1,
    _original: {},
    flightDesignator: 'AR1037',
    flightInstances: [1, 2],
  },
  {
    id: 2,
    _original: {},
    flightDesignator: 'AR1045',
    flightInstances: [1, 2],
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: flightsData[0],
  closeDeleteDialog: jest.fn(),
  reportError: jest.fn(),
  handleDeleteError: jest.fn(),
  deleteDialogIsOpen: false,
  exitDeleteDialog: jest.fn(),
};

const flight = {
  flightDesignator: 'AOP8014',
  from: 'YUL',
  to: 'YYZ',
  departure: '08:04',
  arrival: '10:56',
  daysOfOperation: '1,2,3,4,5,6,7',
  firstDeparture: '27/06/2019',
  lastDeparture: '09/08/2019',
  onwardFlight: 'AOP0121',
  aircraftType: 'E190',
};

const wrapper = mount(<OperatingFlightsDefault {...minProps} />);

test('Operating Flights Component renders correctly with an initial state', () => {
  expect(wrapper).toMatchSnapshot();
});

test('getHeaders returns the right columns', () => {
  const length = getHeaders(jest.fn()).length;
  expect(length).toBe(11);
});

const shallowWrapper = shallow(<OperatingFlights {...minProps} />);

test('deleteOperatingFlight method should remove operating flight properly if deleteOperatingFlight service is resolved', async () => {
  shallowWrapper.setState({ flightsData, fetching: false });
  shallowWrapper.update();

  flightsService.deleteOperatingFlight = jest.fn(() => Promise.resolve());

  flightsService.getOperatingFlightCount = jest.fn(() =>
    Promise.resolve({ count: 1000 })
  );
  await shallowWrapper.instance().deleteOperatingFlight(flightsData[0]);
  await shallowWrapper.instance().setOperatingFlightCount(flightsData[0]);
  expect(shallowWrapper.state().flightsData.length).toBe(1);
  expect(shallowWrapper.state().flightsData[0]).toEqual(flightsData[1]);

  flightsService.deleteOperatingFlight.mockClear();
  flightsService.getOperatingFlightCount.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  shallowWrapper.setState({ flightsData, fetching: false });
  shallowWrapper.update();
  shallowWrapper.instance().deleteOperatingFlight = jest.fn();

  // check whether delete icon click in generic table worked properly
  shallowWrapper
    .find(AccessEnabler)
    .at(0)
    .renderProp('render')()
    .find('GenericTable')
    .prop('handleDeleteItem')(flightsData[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(flightsData[0]);

  //check whether delete button click in DeleteDialog worked properly
  shallowWrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(shallowWrapper.instance().deleteOperatingFlight).toHaveBeenCalledWith(
    flightsData[0]
  );

  shallowWrapper.instance().deleteOperatingFlight.mockClear();
});

let readOnlyWrapper;
test('Operating Flights component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<OperatingFlights {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
