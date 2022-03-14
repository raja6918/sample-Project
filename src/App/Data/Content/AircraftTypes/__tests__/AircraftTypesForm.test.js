import React from 'react';
import { shallow } from 'enzyme';

import AircraftTypesForm from '../AircraftTypesForm';

const minProps = {
  aircraft: {
    id: 10,
    modelId: 10,
    name: 'Aircraft Test',
    restFacilityId: 'NONE',
    type: 'TEST',

    crewComposition: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 12,
        quantity: 1,
      },
    ],
  },
  models: {
    data: [
      { id: 1, code: '777', name: 'test name' },
      { id: 2, code: '359', name: 'test name' },
    ],
  },
  restFacilities: [{ id: 1, name: 'C1-Bunk' }, { id: 2, name: 'C2-Recicling' }],
  formId: 'aircraftForm',
  isOpen: true,
  handleCrewComplements: jest.fn(),

  t: jest.fn(),
  position: {
    id: 10,
    name: 'Flyer',
    code: 'FLY',
    typeNam: 'Flight Deck',
    typeId: 1,
  },
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
  onClose: jest.fn(),
};
const wrapper = shallow(<AircraftTypesForm {...minProps} />);

test('AircraftTypesForm Component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('AircraftTypesForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    aircraftName: '',
    aircraftType: '',
    aircraftModel: '',
    restFacility: 'NONE',
    errors: {
      aircraftName: false,
      aircraftType: false,
    },
    isFormDirty: false,
  });
});

test('AircraftTypesForm Executes its functions correctly and updates the state', () => {
  wrapper.instance().onSelectChange('aircraftModel', 3);
  expect(wrapper.state('aircraftModel')).toEqual(3);
  wrapper.instance().onSelectChange('restFacility', 2);
  expect(wrapper.state('restFacility')).toEqual(2);
  wrapper.instance().onFormChange();
  expect(wrapper.state('isFormDirty')).toEqual(false);
});

let readOnlyWrapper;
test('AircraftTypes Form component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(
    <AircraftTypesForm {...minProps} readOnly={true} />
  );
  expect(readOnlyWrapper).toMatchSnapshot();
});
