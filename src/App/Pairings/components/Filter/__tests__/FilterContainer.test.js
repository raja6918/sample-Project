import React from 'react';
import { shallow } from 'enzyme';
import FilterContainer from '../FilterContainer';
import { filterCriteria } from '../mockData';
import storage from '../../../../../utils/storage';

describe('Test FilterContainer Component', () => {
  const minProps = {
    t: jest.fn(),
    id: 1,
    isCollapsed: false,
    timelineWindows: [
      { id: 1, isOpen: true },
      { id: 2, isOpen: false },
      { id: 3, isOpen: false },
    ],
    filterCriteria: filterCriteria,
    setFilter: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<FilterContainer {...minProps} />);
  });

  afterAll(() => {
    storage.clear();
    wrapper.unmount();
  });

  test('FilterContainer Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Check isFilterOpen state is set when user click on open filter pane button', () => {
    expect(wrapper.state('isFilterOpen')).toBe(false);
    wrapper
      .find('FilterContainer__RoundedButton')
      .at(1)
      .simulate('click');
    expect(wrapper.state('isFilterOpen')).toBe(true);
  });

  test('Check setFilter is called and session storage is set when filter is applied', () => {
    const render = 'pairings';
    const filterBody = {
      type: 'apply',
      filterCriteria: { crewBase: { value: ['YHZ'], type: '' } },
      render: 'pairings',
    };
    wrapper.find('FilterPane').prop('setFilter')(render, filterBody);
    expect(minProps.setFilter).toBeCalledWith(render, minProps.id);
    // check whether session storage is set
    const filterStored = storage.getItem('timelineFilter1');
    expect(filterStored).toEqual(filterBody);
  });

  test('Check setFilter is called and session storage is removed when Reset filter icon is clicked', () => {
    const render = 'pairings';
    wrapper
      .find('FilterContainer__RoundedButton')
      .at(0)
      .simulate('click');
    expect(minProps.setFilter).toBeCalledWith(render, minProps.id);
    // check whether session storage is removed
    const filterStored = storage.getItem('timelineFilter1');
    expect(filterStored).toBe(null);
  });
});
