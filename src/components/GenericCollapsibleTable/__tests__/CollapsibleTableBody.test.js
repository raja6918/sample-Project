import React from 'react';
import { mount, shallow } from 'enzyme';

import TableMUI from '@material-ui/core/Table';
import TableBody from '../TableBody';

import { getHeaders, rulesData } from '../mocks/mockData';
import RuleDescription from '../../../App/Data/Content/Rules/RuleDescription';

const selectedItems = [];
const handleClick = jest.fn().mockImplementation(id => {
  return selectedItems.push(id);
});
const isSelected = jest.fn().mockImplementation(id => {
  return selectedItems.indexOf(id) !== -1;
});
const handleDeleteItem = jest.fn();
const handleEditItem = jest.fn();
const headers = getHeaders(val => val);
const triggerResize = jest.fn();
const disableRowStyle = jest.fn(() => ({}));

const data = rulesData;

describe('Test Collapsible Table Body Component', () => {
  let TableBodyWrapper;
  beforeAll(() => {
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
          triggerResize={triggerResize}
          keyField="code"
          enableEdits={false}
          collapsibleComponent={RuleDescription}
          collapsibleComponentProps={{}}
          disableRowStyle={disableRowStyle}
        />
      </TableMUI>
    );
  });

  test('Toolbar Component renders', () => {
    expect(TableBodyWrapper).toMatchSnapshot();
  });

  test('check if the checkbox is checked', () => {
    expect(
      TableBodyWrapper.find('WithStyles(ForwardRef(Checkbox))')
        .at(0)
        .props().checked
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
          triggerResize={triggerResize}
          keyField="code"
          enableEdits={false}
          collapsibleComponent={RuleDescription}
          collapsibleComponentProps={{}}
          disableRowStyle={disableRowStyle}
        />
      ),
    });
    TableBodyWrapper.update();
    expect(
      TableBodyWrapper.find('WithStyles(ForwardRef(Checkbox))')
        .at(0)
        .props().checked
    ).toBe(true);
  });

  test('check whether openRows state value toggled when collapse is clicked', () => {
    const wrapper = shallow(
      <TableBody
        data={data}
        headers={headers}
        isSelected={isSelected}
        handleClick={handleClick}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        selectedItems={selectedItems}
        triggerResize={triggerResize}
        keyField="code"
        enableEdits={false}
        collapsibleComponent={RuleDescription}
        collapsibleComponentProps={{}}
        disableRowStyle={disableRowStyle}
      />
    );
    expect(wrapper.state('openRows')).toEqual([]);

    // When KeyboardArrowDownIcon is clicked the key is added to state
    wrapper
      .find({ 'aria-label': 'expand row' })
      .at(0)
      .prop('onClick')();
    expect(wrapper.state('openRows')).toEqual([0]);
    expect(triggerResize).toBeCalled();

    // When KeyboardArrowUpIcon is clicked the key is removed from state
    wrapper
      .find({ 'aria-label': 'expand row' })
      .at(0)
      .prop('onClick')();
    expect(wrapper.state('openRows')).toEqual([]);
    expect(triggerResize).toBeCalled();
  });

  test('check whether lastOpenedRowData state value set and reset when collapse is clicked', () => {
    const wrapper = shallow(
      <TableBody
        data={data}
        headers={headers}
        isSelected={isSelected}
        handleClick={handleClick}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        selectedItems={selectedItems}
        triggerResize={triggerResize}
        keyField="code"
        enableEdits={false}
        collapsibleComponent={RuleDescription}
        collapsibleComponentProps={{}}
        disableRowStyle={disableRowStyle}
      />
    );
    expect(wrapper.state('lastOpenedRowData')).toEqual(null);

    // When KeyboardArrowDownIcon is clicked the data is added to state
    wrapper
      .find({ 'aria-label': 'expand row' })
      .at(0)
      .prop('onClick')();
    expect(wrapper.state('lastOpenedRowData')).toEqual(data[0]);
    expect(triggerResize).toBeCalled();

    // When KeyboardArrowUpIcon is clicked the data is removed from state
    wrapper
      .find({ 'aria-label': 'expand row' })
      .at(0)
      .prop('onClick')();
    expect(wrapper.state('lastOpenedRowData')).toEqual(null);
    expect(triggerResize).toBeCalled();
  });
});
