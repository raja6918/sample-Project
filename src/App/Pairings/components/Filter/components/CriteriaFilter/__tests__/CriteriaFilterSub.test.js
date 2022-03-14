import React from 'react';
import { shallow } from 'enzyme';
import CriteriaFilterSub from '../CriteriaFilterSub';
import { filterCriteria } from '../../../mockData';

describe('Test CriteriaFilterSub Component', () => {
  const minProps = {
    t: msg => msg,
    id: 1,
    subMenuOpen: 2,
    catElement: filterCriteria[0].categories[0],
    getfilteredCriteria: jest.fn(),
    handleClose: jest.fn(),
    handleSubMenuOpen: jest.fn(),
    handleSubMenuClose: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<CriteriaFilterSub {...minProps} />);
  });

  test('CriteriaFilterSub Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('toggleItems works correctly on checked', () => {
    const items = [
      { name: 'item1', crId: 1 },
      { name: 'item2', crId: 2 },
      { name: 'item3', crId: 3 },
    ];
    const e = { target: { checked: true } };
    wrapper.instance().setState({
      filteredItems: [items[0], items[1]],
      selectedIds: [items[0].crId, items[1].crId],
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
      items[2].crId,
    ]);
  });

  test('toggleItems works correctly on unchecked', () => {
    const items = [
      { name: 'item1', crId: 1 },
      { name: 'item2', crId: 2 },
      { name: 'item3', crId: 3 },
    ];
    const e = { target: { checked: false } };
    wrapper.instance().setState({
      filteredItems: items,
      selectedIds: items.map(elem => elem.crId),
    });
    wrapper.instance().toggleItems(items[2], e.target.checked);
    expect(wrapper.state('filteredItems')).toEqual(
      items.filter(elem => elem.crId !== items[2].crId)
    );
    expect(wrapper.state('selectedIds')).toEqual(
      items.map(elem => elem.crId).filter(elem => elem !== items[2].crId)
    );
  });

  test('handleFilter works correctly', () => {
    const e = { target: { value: 'Filtering' } };
    wrapper.instance().handleFilter(e);
    expect(wrapper.state('filter')).toBe('Filtering');
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
});
