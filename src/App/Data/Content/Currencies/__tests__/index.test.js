import React from 'react';
import { mount, shallow } from 'enzyme';

import { Currencies } from '../Currencies';
import { getHeaders } from '../constants';
import * as currencyService from '../../../../../services/Data/currencies';

const currencies = [
  {
    code: 'AED',
    exchangeRate: 0.272294,
    id: 1,
    name: 'Emirati Dirham',
  },
  {
    code: 'ALL',
    exchangeRate: 0.009191,
    id: 3,
    name: 'Albanian Lek',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: currencies[0],
  closeDeleteDialog: jest.fn(),
};

const wrapper = mount(<Currencies {...minProps} />);

test('Currencies Component renders correctly with an initial state', () => {
  expect(wrapper).toMatchSnapshot();
});

test('getHeaders returns the right columns', () => {
  const length = getHeaders(jest.fn()).length;
  expect(length).toBe(3);
});

const shallowWrapper = shallow(<Currencies {...minProps} />);

test('deleteCurrency method should remove currency properly if deleteCurrency service resolved', async () => {
  shallowWrapper.setState({ currencies, fetching: false });
  shallowWrapper.update();

  currencyService.deleteCurrency = jest.fn(() => Promise.resolve());

  await shallowWrapper.instance().deleteCurrency(currencies[0]);
  expect(shallowWrapper.state().currencies.length).toBe(1);
  expect(shallowWrapper.state().currencies[0]).toEqual(currencies[1]);

  currencyService.deleteCurrency.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  shallowWrapper.setState({ currencies, fetching: false });
  shallowWrapper.update();
  shallowWrapper.instance().deleteCurrency = jest.fn();

  // check whether delete icon click in generic table worked properly
  shallowWrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(currencies[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(currencies[0]);

  //check whether delete button click in DeleteDialog worked properly
  shallowWrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(shallowWrapper.instance().deleteCurrency).toHaveBeenCalledWith(
    currencies[0]
  );

  shallowWrapper.instance().deleteCurrency.mockClear();
});

let readOnlyWrapper;
test('Currency component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<Currencies {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
