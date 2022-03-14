import React from 'react';
import { mount } from 'enzyme';
import GenericTable from '../GenericTable';

const props = {
  t: jest.fn(() => 'Aircraft Models'),
  order: 'inc',
  orderBy: 'code',
  handleEditItem: jest.fn(),
  name: 'Aircraft Models',
  totalDataSize: 1,
  editMode: true,
  data: [
    { code: '190', name: 'Embraer ERJ-190', id: 6 },
    { code: '220', name: 'Airbus A220', id: 7 },
  ],
  headers: [
    {
      field: 'code',
      displayName: 'Model',
    },
    {
      field: 'name',
      displayName: 'Name',
    },
  ],
};

describe('Tests Related to Generic Table', () => {
  let genericTableWrapper;
  beforeEach(() => {
    genericTableWrapper = mount(<GenericTable {...props} />);
  });

  afterEach(() => {
    genericTableWrapper.unmount();
  });

  test('Generic Table Component Renders Correctly', () => {
    expect(genericTableWrapper).toMatchSnapshot();
  });

  test('check if table row click selects the row', () => {
    let genericTableInstance = genericTableWrapper.instance();
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
    genericTableInstance.handleClick(1);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([1])
    );
  });
  test('check if table row click on selected rows deselects it', () => {
    let genericTableInstance = genericTableWrapper.instance();
    genericTableInstance.setState({ selected: [6] });
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([6])
    );
    genericTableInstance.handleClick(6);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
    expect(genericTableInstance.state.unSelected).toEqual(
      expect.arrayContaining([6])
    );
  });

  test('check if selecting all selects all the rows in table', () => {
    let genericTableInstance = genericTableWrapper.instance();
    let event = { target: { value: true } };
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
    genericTableInstance.handleSelectAllClick(event, true);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([6, 7])
    );
  });

  test('check if deselecting all deselects all the rows in table', () => {
    let genericTableInstance = genericTableWrapper.instance();
    let event = { target: { value: true } };
    genericTableInstance.setState({ selected: [6, 7] });
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([6, 7])
    );
    genericTableInstance.handleSelectAllClick(event, false);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
  });
});
