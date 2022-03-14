import React from 'react';
import { shallow } from 'enzyme';

import PositionsForm from '../PositionsForm';

const minProps = {
  t: jest.fn(),
  position: {
    id: 10,
    name: 'Flyer',
    code: 'FLY',
    typeNam: 'Flight Deck',
    typeId: 1,
  },
  formId: 'positionsForm',
  isOpen: true,
  openItemId: '102',
  openItemName: 'My open item test',
  editMode: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
  onClose: jest.fn(),
  positionTypes: [],
};
const position = {
  id: 10,
  name: 'Flyer',
  code: 'FLY',
  typeNam: 'Flight Deck',
  typeId: 1,
};
const wrapper = shallow(<PositionsForm {...minProps} />);

test('PositionsForm Component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('PositionsForm Component renders correctly with an initial state', () => {
  expect(wrapper.instance().state).toMatchObject({
    positionName: '',
    positionCode: '',
    positionType: '',
    isFormDirty: false,
    errors: {
      positionName: false,
      positionCode: false,
    },
  });
});

test('PositionsForm Executes its functions correctly and updates the state', () => {
  wrapper.instance().onSelectChange();
  wrapper.instance().onFormChange();
  expect(wrapper.state('isFormDirty')).toEqual(false);
});

let readOnlyWrapper;
test('Position Form component render correct in readOnly mode', () => {
  readOnlyWrapper = shallow(<PositionsForm {...minProps} readOnly={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
});
