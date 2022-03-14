import React from 'react';
import { shallow } from 'enzyme';

import AircraftModelForm from '../AircraftModelForm';
import { MODEL_NAME_REGEX } from '../constants';

const minProps = {
  t: jest.fn(() => ''),
  model: null,
  formId: 'modelsForm',
  isOpen: true,
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
};

const wrapper = shallow(<AircraftModelForm {...minProps} />);

test('AircraftModelForm Component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('AircraftModelForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    modelName: '',
    modelCode: '',
    isFormDirty: false,
    errors: {
      modelCode: false,
      modelName: false,
    },
  });
});

test('AircraftModelForm executes its functions correctly and updates the state', () => {
  const event = {
    target: {
      name: 'modelName',
      value: '_invalidmodel name',
    },
  };

  wrapper.instance().handleChange(event, MODEL_NAME_REGEX);
  wrapper.instance().onFormChange();
  expect(wrapper.state('isFormDirty')).toEqual(false);
});

let readOnlyWrapper;
test('Aircraft model form component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(
    <AircraftModelForm {...minProps} readOnly={true} />
  );
  expect(readOnlyWrapper).toMatchSnapshot();
});
