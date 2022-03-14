import React from 'react';
import { shallow } from 'enzyme';
import ResetButton from '../ResetButton';

const mockProps = {
  data: { name: 'hello' },
  handleReset: jest.fn(),
  tooltipContent: 'Test Tooltip Content',
};

let wrapper;
beforeAll(() => {
  wrapper = shallow(<ResetButton {...mockProps} />);
});

test('ResetButton Component render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('check whether handleReset prop is called on click event', () => {
  wrapper.find({ 'aria-label': 'reset icon' }).simulate('click');
  expect(mockProps.handleReset).toBeCalledWith(mockProps.data);
});

let readOnlyWrapper;
test('ResetButton Component render correctly when it is disabled', () => {
  readOnlyWrapper = shallow(<ResetButton {...mockProps} disabled={true} />);
  expect(readOnlyWrapper).toMatchSnapshot();
  expect(
    readOnlyWrapper.find({ 'aria-label': 'reset icon' }).props()['disabled']
  ).toBe(true);
  expect(readOnlyWrapper.find({ fontSize: 'small' }).prop('color')).toBe(
    'disabled'
  );
});
