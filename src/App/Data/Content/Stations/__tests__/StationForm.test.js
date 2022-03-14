import React from 'react';
import { shallow } from 'enzyme';

import StationForm from '../StationForm';

import API from '../../../../../utils/API';

const station = {
  code: 'VAB',
  name: 'Viva Aerobus',
  country: 'Mexico',
  region: 'America',
  timeZone: '',
  latitude: 0.3,
  longitude: 0.5,
  dst: 120,
  dstStartDateTime: '2018-05-8T18:30:09.586Z',
  dstEndDateTime: '2018-05-18T8:30:00.586Z',
};

const minProps = {
  t: jest.fn(() => ''),
  handleCancel: jest.fn(),
  openItemId: '1',
  handleOk: jest.fn(),
  station: station,
  formId: 'idTest',
  isOpen: false,
};
const wrapper = shallow(<StationForm {...minProps} />);

test('StationForm Component renders correctly.', () => {
  expect(wrapper).toMatchSnapshot();
});

test('StationForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    countryCode: '',
    countries: [],
    regionCode: '',
    regions: [],
    isFormDirty: false,
  });
});
test('Initial state changes for "countries & regions" object after promise is completed', () => {
  Promise.all([
    API.get('/stations/countries'),
    API.get('/stations/regions'),
  ]).then(([countries, regions]) => {
    wrapper.setState({
      countries,
      regions,
    });
    wrapper.update();
    expect(wrapper.state('countries')).toEqual(
      expect.arrayContaining(countries)
    );
    expect(wrapper.state('regions')).toEqual(expect.arrayContaining(regions));
  });
});
