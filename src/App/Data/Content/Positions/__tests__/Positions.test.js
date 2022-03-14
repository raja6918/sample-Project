import React from 'react';
import { mount, shallow } from 'enzyme';

import { Positions } from '../Positions';
import { getHeaders } from '../constants';
import * as positionsService from '../../../../../services/Data/positions';

const positions = [
  {
    id: 1,
    code: 'CPT',
  },
  {
    id: 2,
    code: 'FO',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: positions[0],
  closeDeleteDialog: jest.fn(),
};
const position = {
  id: 10,
  name: 'Flyer',
  code: 'FLY',
  typeNam: 'Flight Deck',
  typeId: 1,
};
const wrapper = mount(<Positions {...minProps} />);

test('Positions Component renders correctly with an initial state', () => {
  expect(wrapper).toMatchSnapshot();
});

test('getHeaders returns the right columns', () => {
  const length = getHeaders(jest.fn()).length;
  expect(length).toBe(3);
});

test('Positions Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    positions: [],
    fetching: true,
    message: null,
    snackType: '',
    selectedPosition: null,
    isFormOpen: false,
  });
});

test('addPosition function works', () => {
  wrapper.instance().addPosition(position);
});

test('onClearSnackBar function works', () => {
  wrapper.instance().onClearSnackBar();
  expect(wrapper.state('message')).toEqual(null);
  expect(wrapper.state('snackBarType')).toEqual('');
});

test.skip('toggleForm function works', () => {
  wrapper.instance().toggleForm();
  expect(wrapper.state('isFormOpen')).toEqual(true);
  wrapper.instance().toggleForm();
  expect(wrapper.state('isFormOpen')).toEqual(false);
});

const shallowWrapper = shallow(<Positions {...minProps} />);

test('deletePosition method should remove position properly if deletePosition service is resolved', async () => {
  shallowWrapper.setState({ positions, fetching: false });
  shallowWrapper.update();

  positionsService.deletePosition = jest.fn(() => Promise.resolve());

  await shallowWrapper.instance().deletePosition(positions[0]);
  expect(shallowWrapper.state().positions.length).toBe(1);
  expect(shallowWrapper.state().positions[0]).toEqual(positions[1]);

  positionsService.deletePosition.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  shallowWrapper.setState({ positions, fetching: false });
  shallowWrapper.update();
  shallowWrapper.instance().deletePosition = jest.fn();

  // check whether delete icon click in generic table worked properly
  shallowWrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(positions[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(positions[0]);

  //check whether delete button click in DeleteDialog worked properly
  shallowWrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(shallowWrapper.instance().deletePosition).toHaveBeenCalledWith(
    positions[0]
  );

  shallowWrapper.instance().deletePosition.mockClear();
});

let readOnlyWrapper;
test('Positions component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<Positions {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
