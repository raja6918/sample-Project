import React from 'react';
import { shallow } from 'enzyme';
import FilterPaneFooter from '../FilterPaneFooter';

describe('Test FilterPaneFooter Component', () => {
  const minProps = {
    t: jest.fn(),
    enableSave: true,
    handleCancel: jest.fn(),
    handleApply: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<FilterPaneFooter {...minProps} />);
  });

  test('FilterPaneFooter Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('handleCancel should be called on Cancel button click', () => {
    wrapper
      .find({ color: 'primary' })
      .at(0)
      .simulate('click');
    expect(minProps.handleCancel).toBeCalled();
  });

  test('handleApply should be called on Apply button click', () => {
    wrapper
      .find({ color: 'primary' })
      .at(1)
      .simulate('click');
    expect(minProps.handleApply).toBeCalled();
  });
});
