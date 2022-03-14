import React from 'react';
import { shallow } from 'enzyme';
import FormBodyTitle from '../FormBodyTitle';

describe('Test FormBodyTitle Component', () => {
  const minProps = {
    t: jest.fn(),
    type: 'new',
    enableClearAll: true,
    handleClearAll: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<FormBodyTitle {...minProps} />);
  });

  test('FormBodyTitle Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('handleClearAll should be called on clear icon click', () => {
    wrapper.find('FormBodyTitle__ClearAllButton').simulate('click');
    expect(minProps.handleClearAll).toBeCalled();
  });
});
