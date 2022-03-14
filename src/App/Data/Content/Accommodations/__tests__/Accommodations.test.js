import React from 'react';
import { mount, shallow } from 'enzyme';

import { Accommodations } from '../Accommodations';
import * as accommodationsService from '../../../../../services/Data/accommodations';

const accommodations = [
  {
    billingPolicyCode: 'PER_24H_BLOCKS',
    capacity: 123,
    checkInTime: null,
    checkOutTime: null,
    contractLastDate: '2019-05-30',
    contractStartDate: '2019-05-30',
    cost: 89,
    costDisplay: '89.00 CAD',
    currencyCode: 'CAD',
    extendedStayCostFactor: 50,
    id: 700044,
    name: ' Holiday Inn Ambassador',
    stationCodes: ['YQG'],
    typeCode: 'STATION',
    typeDisplayName: 'Station',
  },
  {
    billingPolicyCode: 'PER_24H_BLOCKS',
    capacity: 123,
    checkInTime: null,
    checkOutTime: null,
    contractLastDate: '2019-05-30',
    contractStartDate: '2019-05-30',
    cost: 88.2,
    costDisplay: '88.20 CAD',
    currencyCode: 'CAD',
    extendedStayCostFactor: 50,
    id: 700011,
    name: 'Club Quarters Hotel',
    stationCodes: ['IAH'],
    typeCode: 'STATION',
    typeDisplayName: 'Station',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: accommodations[0],
  closeDeleteDialog: jest.fn(),
};

const accommodation = {
  capacity: '30',
  checkInTime: '',
  checkOutTime: '',
  contractEndDate: '2018-11-30T22:25:09.586Z',
  contractStartDate: '2018-11-01T22:25:09.586Z',
  cost: '1200',
  costExtendedStay: '999',
  currency: 'MXN',
  id: '8',
  name: 'Fiesta Inn',
  paymentType: '24HourBlock',
  restType: 'City',
  stationCodes: ['MEX', 'CUN'],
  nightlyRate: '1200 MXN',
};
const accommodationFormatted = {
  capacity: '30',
  checkInTime: '',
  checkOutTime: '',
  contractEndDate: '2018-11-30T22:25:09.586Z',
  contractStartDate: '2018-11-01T22:25:09.586Z',
  cost: '1200',
  costExtendedStay: '999',
  currency: 'MXN',
  id: '8',
  name: 'Fiesta Inn',
  paymentType: '24HourBlock',
  restType: 'City',
  stationCodes: ['MEX', 'CUN'],
  stationsStr: 'MEX, CUN',
  nightlyRate: '1200 MXN',
};
const wrapper = mount(<Accommodations {...minProps} />);

test('Accommodations Component renders correctly with an initial state', () => {
  expect(wrapper).toMatchSnapshot();
});

test('getFormattedAccommodationData functions returns a formatted object', () => {
  const formattedAccommodation = wrapper
    .instance()
    .getFormattedAccommodationData(accommodation);
  expect(formattedAccommodation).toEqual(accommodationFormatted);
});

const shallowWrapper = shallow(<Accommodations {...minProps} />);

test('deleteAccommodation method should remove accommodation properly if deleteAccommodation service resolved', async () => {
  shallowWrapper.setState({ accommodations, fetching: false });
  shallowWrapper.update();

  accommodationsService.deleteAccommodation = jest.fn(() => Promise.resolve());

  await shallowWrapper.instance().deleteAccommodation(accommodations[0]);
  expect(shallowWrapper.state().accommodations.length).toBe(1);
  expect(shallowWrapper.state().accommodations[0]).toEqual(accommodations[1]);

  accommodationsService.deleteAccommodation.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  shallowWrapper.setState({ accommodations, fetching: false });
  shallowWrapper.update();
  shallowWrapper.instance().deleteAccommodation = jest.fn();

  // check whether delete icon click in generic table worked properly
  shallowWrapper
    .find('Connect(AccessEnabler)')
    .at(0)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(accommodations[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(accommodations[0]);

  //check whether delete button click in DeleteDialog worked properly
  shallowWrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(shallowWrapper.instance().deleteAccommodation).toHaveBeenCalledWith(
    accommodations[0]
  );

  shallowWrapper.instance().deleteAccommodation.mockClear();
});

let readOnlyWrapper;
test('Accomodations component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<Accommodations {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
