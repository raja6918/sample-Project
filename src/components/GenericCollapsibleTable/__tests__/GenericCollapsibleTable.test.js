import React from 'react';
import { mount } from 'enzyme';
import GenericCollapsibleTable from '../GenericCollapsibleTable';
import { getHeaders, rulesData } from '../mocks/mockData';
import { MockCollapsibleComponent } from '../mocks/MockComponents';

const props = {
  t: jest.fn(val => val),
  order: 'inc',
  orderBy: 'code',
  handleEditItem: jest.fn(),
  name: 'Rules',
  totalDataSize: 1,
  editMode: true,
  data: rulesData,
  headers: getHeaders(val => val),
  collapsibleComponent: MockCollapsibleComponent,
  enableEdits: false,
};

describe('Tests Related to Generic Table', () => {
  let genericTableWrapper;
  beforeAll(() => {
    genericTableWrapper = mount(<GenericCollapsibleTable {...props} />);
  });

  afterAll(() => {
    genericTableWrapper.unmount();
  });

  test('Generic collapsible Table Component Renders Correctly', () => {
    expect(genericTableWrapper).toMatchSnapshot();
  });

  test('check if table row click selects the row', () => {
    const genericTableInstance = genericTableWrapper.instance();
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
    genericTableInstance.handleClick(1);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([1])
    );
  });
  test('check if table row click on selected rows deselects it', () => {
    const genericTableInstance = genericTableWrapper.instance();
    genericTableInstance.setState({ selected: [5] });
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([5])
    );
    genericTableInstance.handleClick(5);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
    expect(genericTableInstance.state.unSelected).toEqual(
      expect.arrayContaining([5])
    );
  });

  test('check if selecting all selects all the rows in table', () => {
    const genericTableInstance = genericTableWrapper.instance();
    const event = { target: { value: true } };
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([])
    );
    genericTableInstance.handleSelectAllClick(event, true);
    expect(genericTableInstance.state.selected).toEqual(
      expect.arrayContaining([1, 2, 3, 4, 5])
    );
  });

  test('check if deselecting all deselects all the rows in table', () => {
    const genericTableInstance = genericTableWrapper.instance();
    const event = { target: { value: true } };
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
