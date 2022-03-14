import React from 'react';
import { shallow } from 'enzyme';

import RegionsForm from '../RegionsForm';

const minProps = {
  t: jest.fn(),
  region: {
    id: 1,
    name: 'Region name',
    code: 'RNA',
  },
  formId: 'regionsForm',
  isOpen: true,
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
};

const wrapper = shallow(<RegionsForm {...minProps} />);

test('RegionsForm Component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('RegionsForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    regionName: '',
    regionCode: '',
    isFormDirty: false,
    errors: {
      regionCode: false,
      regionName: false,
    },
  });
});

test('RegionsForm executes its functions correctly and updates the state', () => {
  wrapper.instance().onFormChange();
  expect(wrapper.state('isFormDirty')).toEqual(false);
});

let readOnlyWrapper;
test('Regions Form component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<RegionsForm {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
