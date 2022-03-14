import React from 'react';
import { shallow } from 'enzyme';

import CountriesForm from '../CountriesForm';

const minProps = {
  t: jest.fn(),
  country: {
    id: 10,
    name: 'Mexico',
    code: 'MX',
    currencyCode: 'MNX',
    currencyId: 12,
  },
  formId: 'countriesForm',
  isOpen: true,
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
};
const currencies = [
  { id: 101, name: 'Norwegian Krone', code: 'NOK', exchangeRateUsd: 0.120554 },
  { id: 102, name: 'Nepalese Rupee', code: 'NPR', exchangeRateUsd: 0.008465 },
  { id: 106, name: 'Peruvian Sol', code: 'PEN', exchangeRateUsd: 0.299732 },
  { id: 104, name: 'Omani Rial', code: 'OMR', exchangeRateUsd: 2.60078 },
  { id: 105, name: 'Panamanian Balboa', code: 'PAB', exchangeRateUsd: 1 },
];
const wrapper = shallow(<CountriesForm {...minProps} />);

test('CountriesForm Component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('CountriesForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    countryName: '',
    countryCode: '',
    currencyCode: null,
    currencies: [],
    isFormDirty: false,
    errors: {
      countryCode: false,
      countryName: false,
    },
  });
});

test('CountriesForm Executes its functions correctly and updates the state', () => {
  wrapper.instance().onSelectChange();
  wrapper.instance().onFormChange();
  expect(wrapper.state('isFormDirty')).toEqual(false);
});

let readOnlyWrapper;
test('Countries Form component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<CountriesForm {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
