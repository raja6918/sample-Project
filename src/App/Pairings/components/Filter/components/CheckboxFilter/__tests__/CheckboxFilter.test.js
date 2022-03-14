import React from 'react';
import { shallow } from 'enzyme';
import { CheckboxFilter } from '../CheckboxFilter';
import { getLayoverAt } from '../../../mockData';

describe('Test CheckboxFilter Component', () => {
  const minProps = {
    t: jest.fn(),
    name: 'Test Name',
    enableServerSearch: true,
    searchBox: true,
    render: 'dynamic',
    onChange: jest.fn(),
    handleRemoveCriteria: jest.fn(),
    dataResolver: getLayoverAt,
    reportError: jest.fn(),
    tooltipKey: 'display',
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<CheckboxFilter {...minProps} />);
  });

  test('CheckboxFilter Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('toggleItems works correctly on checked', () => {
    const items = [
      { name: 'item1', value: 1 },
      { name: 'item2', value: 2 },
      { name: 'item3', value: 3 },
    ];
    const e = { target: { checked: true } };
    wrapper.instance().setState({
      filteredItems: [items[0], items[1]],
      selectedIds: [items[0].value, items[1].value],
    });
    const state = {
      filteredItems: wrapper.state('filteredItems'),
      selectedIds: wrapper.state('selectedIds'),
    };
    wrapper.instance().toggleItems(items[2], e.target.checked);
    expect(wrapper.state('filteredItems')).toEqual([
      ...state.filteredItems,
      items[2],
    ]);
    expect(wrapper.state('selectedIds')).toEqual([
      ...state.selectedIds,
      items[2].value,
    ]);
    expect(minProps.onChange).toBeCalledWith(
      expect.arrayContaining(items.map(elem => elem.value)),
      expect.arrayContaining(items),
      expect.any(Boolean)
    );
  });

  test('toggleItems works correctly on unchecked', () => {
    const items = [
      { name: 'item1', value: 1 },
      { name: 'item2', value: 2 },
      { name: 'item3', value: 3 },
    ];
    const e = { target: { checked: false } };
    wrapper.instance().setState({
      filteredItems: items,
      selectedIds: items.map(elem => elem.value),
    });
    wrapper.instance().toggleItems(items[2], e.target.checked);
    expect(wrapper.state('filteredItems')).toEqual(
      items.filter(elem => elem.value !== items[2].value)
    );
    expect(wrapper.state('selectedIds')).toEqual(
      items.map(elem => elem.value).filter(elem => elem !== items[2].value)
    );
    expect(minProps.onChange).toBeCalledWith(
      expect.arrayContaining(
        items.map(elem => elem.value).filter(elem => elem !== items[2].value)
      ),
      expect.arrayContaining(items.filter(elem => elem !== items[2].value)),
      expect.any(Boolean)
    );
  });

  test('handleFilter works correctly', () => {
    const e = { target: { value: 'Filtering' } };
    wrapper.instance().handleFilter(e);
    expect(wrapper.state('filter')).toBe('Filtering');
    wrapper
      .instance()
      .handleFilter(e)
      .then(() => {
        expect(wrapper.state('filter')).toBe('Filtering');
      });
  });

  test('handleClearFilter works correctly', () => {
    wrapper.instance().handleClearFilter();
    expect(wrapper.state('filter')).toBe('');
  });

  test('handleClearAll works correctly', () => {
    wrapper
      .instance()
      .setState({ filteredItems: ['item1', 'item2'], selectedIds: [1, 2] });
    wrapper.instance().handleClearAll();
    expect(wrapper.state('filteredItems')).toEqual([]);
    expect(wrapper.state('selectedIds')).toEqual([]);
  });

  test('getTooltipContent works correctly when tooltipKey prop is "display"', () => {
    const data = { display: 'smalltext' };
    const result = wrapper.instance().getTooltipContent(data);
    expect(result).toBeNull();
  });

  test('getTooltipContent works correctly when tooltipKey prop is not "display"', () => {
    wrapper = shallow(<CheckboxFilter {...minProps} tooltipKey="somekey" />);
    const data = { somekey: 'some text' };
    const result = wrapper.instance().getTooltipContent(data);
    expect(result).toBe(data.somekey);
  });
});
