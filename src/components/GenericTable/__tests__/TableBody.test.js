import React from 'react';
import { mount } from 'enzyme';

import TableMUI from '@material-ui/core/Table';
import TableBody from '../TableBody';

const selectedItems = [];
const handleClick = jest.fn().mockImplementation(id => {
  return selectedItems.push(id);
});
const isSelected = jest.fn().mockImplementation(id => {
  return selectedItems.indexOf(id) !== -1;
});
const handleDeleteItem = jest.fn();
const handleEditItem = jest.fn();
const handleDisableDelete = jest.fn();
const headers = [
  { field: 'code', displayName: 'Code' },
  { field: 'name', displayName: 'Name' },
];

const data = [{ id: 1, code: 'AEM', name: 'Aero Mexico' }];

describe('Test Table Body Component', () => {
  let TableBodyWrapper;
  beforeEach(() => {
    TableBodyWrapper = mount(
      <TableMUI>
        <TableBody
          data={data}
          headers={headers}
          isSelected={isSelected}
          handleClick={handleClick}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
          selectedItems={selectedItems}
          handleDisableDelete={handleDisableDelete}
        />
      </TableMUI>
    );
  });

  test('Toolbar Component renders', () => {
    expect(TableBodyWrapper).toMatchSnapshot();
  });

  test('check if the checkbox is checked', () => {
    expect(
      TableBodyWrapper.find('WithStyles(ForwardRef(Checkbox))').props().checked
    ).toBe(false);
    TableBodyWrapper.setProps({
      children: (
        <TableBody
          data={data}
          headers={headers}
          isSelected={() => true}
          handleClick={handleClick}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
          selectedItems={[1]}
          handleDisableDelete={handleDisableDelete}
        />
      ),
    });
    TableBodyWrapper.update();
    expect(
      TableBodyWrapper.find('WithStyles(ForwardRef(Checkbox))').props().checked
    ).toBe(true);
  });
});
