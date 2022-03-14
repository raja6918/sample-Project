import React from 'react';
import { shallow } from 'enzyme';
import CriteriaFilter from '../CriteriaFilter';
import { filterCriteria } from '../../../mockData';

describe('Test CriteriaFilter Component', () => {
  const minProps = {
    t: jest.fn(),
    categories: filterCriteria[0].categories,
    getfilteredCriteria: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<CriteriaFilter {...minProps} />);
  });

  test('CriteriaFilter Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('handleMenuClick works correctly', () => {
    const event = { currentTarget: 'menu' };
    wrapper.instance().handleMenuClick(event);
    expect(wrapper.state('anchorEl')).toBe('menu');
  });

  test('handleMenuClose works correctly', () => {
    wrapper.instance().handleMenuClose();
    expect(wrapper.state('anchorEl')).toBeNull();
  });

  test('handleSubMenuOpen works correctly', () => {
    wrapper.instance().handleSubMenuOpen(2);
    expect(wrapper.state('subMenuOpen')).toBe(2);
  });

  test('handleSubMenuClose works correctly', () => {
    wrapper.instance().handleSubMenuClose();
    expect(wrapper.state('subMenuOpen')).toBeNull();
  });
});
