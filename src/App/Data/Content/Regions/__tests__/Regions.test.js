import React from 'react';
import { shallow } from 'enzyme';

import { Regions } from '../Regions';
import { getHeaders } from '../constants';

import * as regionsService from '../../../../../services/Data/regions';

const regions = [
  {
    code: 'CAN',
    name: 'CAN',
    id: 3,
  },
  {
    code: 'EUR',
    name: 'EUR',
    id: 5,
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: regions[0],
  closeDeleteDialog: jest.fn(),
};

const region = {
  id: 2,
  name: 'region name',
  code: 'RNA',
};

const wrapper = shallow(<Regions {...minProps} />);

test('Regions Component renders', () => {
  expect(shallow(<Regions {...minProps} />)).toMatchSnapshot();
});

test('Regions Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    regions: [],
    message: null,
    snackType: '',
    selectedRegion: null,
    fetching: true,
    isFormOpen: false,
  });
});

test('getHeaders returns the right columns', () => {
  const columns = getHeaders(jest.fn());
  expect(columns.length).toBe(2);
});

test('addCountry function works', () => {
  wrapper.instance().addRegion(region);
});

test('editCountry function works', () => {
  wrapper.instance().editRegion(region, region.id);
});

test('deleteRegion method should remove region properly if deleteRegion service is resolved', async () => {
  wrapper.setState({ regions, fetching: false });
  wrapper.update();

  regionsService.deleteRegion = jest.fn(() => Promise.resolve());

  await wrapper.instance().deleteRegion(regions[0]);
  expect(wrapper.state().regions.length).toBe(1);
  expect(wrapper.state().regions[0]).toEqual(regions[1]);

  regionsService.deleteRegion.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', () => {
  wrapper.setState({ regions, fetching: false });
  wrapper.update();
  wrapper.instance().deleteRegion = jest.fn();

  // check whether delete icon click in generic table worked properly
  wrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(regions[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(regions[0]);

  //check whether delete button click in DeleteDialog worked properly
  wrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(wrapper.instance().deleteRegion).toHaveBeenCalledWith(regions[0]);

  wrapper.instance().deleteRegion.mockClear();
});

let readOnlyWrapper;
test('Regions component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<Regions {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
