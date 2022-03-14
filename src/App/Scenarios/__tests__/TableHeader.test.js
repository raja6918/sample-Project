import React from 'react';
import { shallow } from 'enzyme';
import TableHeader from '../TableHeader';

const minProps = {
  t: jest.fn(),
  top: 0,
  stickyHeader: 'Today',
  handleAdd: jest.fn(),
  handleCreatedBy: jest.fn(),
};

const wrapper = shallow(<TableHeader {...minProps} />);

test('TableHeader component renders correct', () => {
  expect(wrapper).toMatchSnapshot();
});

test('onClick handler works without crashing', () => {
  wrapper.instance().onClick();
});

test('openCreatedBy function set a correct target', () => {
  const e = {
    currentTarget: jest.fn(),
  };

  wrapper.instance().openCreatedBy(e);
  const target = wrapper.state('anchorEl');
  expect(target).toBe(e.currentTarget);
});

test('handleClose function works correct', () => {
  wrapper.instance().handleClose();
  const anchorEl = wrapper.state('anchorEl');

  expect(anchorEl).toBe(null);
});
