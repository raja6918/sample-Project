import React from 'react';
import { shallow } from 'enzyme';

import CrewBaseForm from '../CrewBasesForm';

const minProps = {
  t: jest.fn(),
  crewBase: {
    bases: [
      {
        code: 'MX',
        name: 'Mexico',
      },
      {
        code: 'TST',
        name: 'Test Name',
      },
    ],
    countryCode: 'MX',
    countryName: 'Mexico',
    name: 'Station TEST',
    id: 10,
  },
  updateBases: jest.fn(),
  formId: 'CrewBaseForm',
  isOpen: true,
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
};
const stations = [
  {
    code: 'MX',
    name: 'Mexico',
  },
];
const stationCodes = ['MX', 'TST'];
const wrapper = shallow(<CrewBaseForm {...minProps} />);

test('CrewBaseForm Component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('CrewBaseForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    baseName: '',
    country: null,
    countries: [],
    stationSuggestions: [],
    stationCodes: [],
    isFormDirty: false,
    errors: {
      baseName: false,
    },
  });
});

test('Stations are formated correctly for multy selection', () => {
  expect(wrapper.instance().formatStations(stations)).toMatchObject([
    {
      display: 'MX - Mexico',
      value: 'MX',
    },
  ]);
});

test('handleRenderValues concatenate bases code correctly', () => {
  expect(wrapper.instance().handleRenderValues(stationCodes)).toEqual(
    'MX, TST'
  );
});

let readOnlyWrapper;
test('Crewbase Form component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<CrewBaseForm {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
