import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Header from '../TableHeader';

const minProps = {
  t: jest.fn(),
  top: 0,
  stickyHeader: 'Today',
  isDisabled: false,
  handleAdd: jest.fn(),
  handleCreatedBy: jest.fn('ANYONE'),
};
const wrapper = shallow(<Header {...minProps} />);

test('Header Component renders correct sticky header', () => {
  expect(
    wrapper
      .find('StickyHeader')
      .children()
      .text()
  ).toEqual(minProps.stickyHeader);
});

test('Header renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
