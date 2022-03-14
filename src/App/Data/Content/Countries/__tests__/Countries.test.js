import React from 'react';
import { shallow } from 'enzyme';

import { Countries } from '../Countries';
import * as countriesService from '../../../../../services/Data/countries';

const countries = [
  {
    code: 'AD',
    currencyCode: 'EUR',
    id: 6,
    name: 'Andorra',
  },
  {
    code: 'AG',
    currencyCode: 'XCD',
    id: 10,
    name: 'Antigua and Barbuda',
  },
];

const minProps = {
  t: jest.fn(() => ''),
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: countries[0],
  closeDeleteDialog: jest.fn(),
};
const country = {
  id: 10,
  name: 'Mexico',
  code: 'MX',
  currencyCode: 'MNX',
  currencyId: 12,
};
const wrapper = shallow(<Countries {...minProps} />);
test('Countries Component renders', () => {
  expect(shallow(<Countries {...minProps} />)).toMatchSnapshot();
});

test('Countries Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    countries: [],
    message: null,
    snackType: '',
    selectedCountry: null,
    fetching: true,
    isFormOpen: false,
  });
});

test('addCountry function works', () => {
  wrapper.instance().addCountry(country);
});

test('editCountry function works', () => {
  wrapper.instance().editCountry(country, country.id);
});

test('deleteCountry method should remove country properly if deleteCountry service resolved', async () => {
  wrapper.setState({ countries, fetching: false });
  wrapper.update();

  countriesService.deleteCountry = jest.fn(() => Promise.resolve());

  await wrapper.instance().deleteCountry(countries[0]);
  expect(wrapper.state().countries.length).toBe(1);
  expect(wrapper.state().countries[0]).toEqual(countries[1]);

  countriesService.deleteCountry.mockClear();
});

test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
  wrapper.setState({ countries, fetching: false });
  wrapper.update();
  wrapper.instance().deleteCountry = jest.fn();

  // check whether delete icon click in generic table worked properly
  wrapper
    .find('Connect(AccessEnabler)')
    .at(1)
    .renderProp('render')({ disableComponent: false })
    .find('GenericTable')
    .prop('handleDeleteItem')(countries[0]);
  expect(minProps.openDeleteDialog).toHaveBeenCalledWith(countries[0]);

  //check whether delete button click in DeleteDialog worked properly
  wrapper.find('DeleteDialog').prop('handleOk')();
  expect(minProps.closeDeleteDialog).toHaveBeenCalled();
  expect(wrapper.instance().deleteCountry).toHaveBeenCalledWith(countries[0]);

  wrapper.instance().deleteCountry.mockClear();
});

let readOnlyWrapper;
test('Countries component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<Countries {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
