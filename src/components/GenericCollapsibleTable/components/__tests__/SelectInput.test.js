import React from 'react';
import { mount, shallow } from 'enzyme';
import SelectInput from '../SelectInput';
import { stateData } from '../../mocks/mockData';

const mockProps = {
  data: { name: 'hello' },
  items: stateData,
  onChange: value => value,
  value: true,
  style: { width: '100%' },
  handleDisable: () => false,
  removeOverlay: jest.fn(),
};

let wrapper;
beforeAll(() => {
  wrapper = mount(<SelectInput {...mockProps} />);
});

afterAll(() => {
  wrapper.unmount();
});

test('SelectInput Component render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('check whether selectValue state value changed on onChange event', () => {
  expect(wrapper.state('selectValue')).toEqual(true);

  wrapper.find('WithStyles(ForwardRef(Select))').prop('onChange')({
    target: {
      value: false,
    },
  });

  expect(wrapper.state('selectValue')).toEqual(false);
});

test('check whether removeOverlay prop is called on click event', () => {
  wrapper.find('WithStyles(ForwardRef(Select))').prop('onClick')();

  expect(mockProps.removeOverlay).toBeCalled();
});

let readOnlyWrapper;
test('SelectInput Component render correctly when it is disabled', () => {
  readOnlyWrapper = shallow(
    <SelectInput {...mockProps} handleDisable={() => true} />
  );
  expect(readOnlyWrapper).toMatchSnapshot();
});
