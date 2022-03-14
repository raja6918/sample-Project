import React from 'react';
import { shallow } from 'enzyme';

import { CoterminalTransports } from '../CoterminalTransports';
import * as coterminalTransportsService from '../../../../../services/Data/coterminalTransports';

import { getHeaders } from '../Constants';

const coterminalTransports = [
  {
    arrivalStationCode: 'JFK',
    billingPolicyCode: 'PER_CREW_MEMBER',
    capacity: 12,
    cost: 50,
    credit: 0,
    creditPolicyCode: 'ALL',
    currencyCode: 'USD',
    departureStationCode: 'LGA',
    id: 3,
    inboundTiming: null,
    isBidirectional: false,
    name: 'Golden Touch Transportation',
    typeCode: 'STATION_SHUTTLE',
    typeDisplayName: 'Station shuttle',
  },
  {
    arrivalStationCode: 'LHR',
    billingPolicyCode: 'PER_CREW_MEMBER',
    capacity: 6,
    cost: 40,
    credit: 0,
    creditPolicyCode: 'ALL',
    currencyCode: 'GBP',
    departureStationCode: 'LGW',
    id: 2,
    inboundTiming: null,
    isBidirectional: false,
    name: 'Royal Windsor Transport',
    typeCode: 'STATION_SHUTTLE',
    typeDisplayName: 'Station shuttle',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  editMode: false,
  openItemId: '1',
  openItemName: 'Scenario test',
  openDeleteDialog: jest.fn(),
  deleteDialogItem: coterminalTransports[0],
  closeDeleteDialog: jest.fn(),
};
const wrapper = shallow(<CoterminalTransports {...minProps} />);

test('Coterminal Transports component render correct', () => {
  expect(wrapper).toMatchSnapshot();
});

test('Coterminal Transports Component renders correctly with an initial state', () => {
  expect(wrapper.state()).toMatchObject({
    fetching: true,
    coterminalTransports: [],
    selectedCoterminalTransport: null,
    isFormOpen: false,
    message: null,
    snackType: '',
  });
});

test('getHeaders returns the right columns', () => {
  const columns = getHeaders(jest.fn());
  expect(columns.length).toBe(5);
});

test('deleteCoterminalTransport method should remove transport properly if deleteCoterminalTransport service resolved', async () => {
  wrapper.setState({ coterminalTransports, fetching: false });
  wrapper.update();

  coterminalTransportsService.deleteCoterminalTransport = jest.fn(() =>
    Promise.resolve()
  );

  await wrapper.instance().deleteCoterminalTransport(coterminalTransports[0]);
  expect(wrapper.state().coterminalTransports.length).toBe(1);
  expect(wrapper.state().coterminalTransports[0]).toEqual(
    coterminalTransports[1]
  );

  coterminalTransportsService.deleteCoterminalTransport.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  wrapper.setState({ coterminalTransports, fetching: false });
  wrapper.update();
  wrapper.instance().deleteCoterminalTransport = jest.fn();

  // check whether delete icon click in generic table worked properly
  wrapper
    .find('Connect(AccessEnabler)')
    .at(0)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(coterminalTransports[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(
    coterminalTransports[0]
  );

  //check whether delete button click in DeleteDialog worked properly
  wrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(wrapper.instance().deleteCoterminalTransport).toHaveBeenCalledWith(
    coterminalTransports[0]
  );

  wrapper.instance().deleteCoterminalTransport.mockClear();
});

let readOnlyWrapper;
test('Coterminal Transports component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(
    <CoterminalTransports {...minProps} readOnly={true} />
  );
  expect(readOnlyWrapper).toMatchSnapshot();
});
