import React from 'react';
import { shallow } from 'enzyme';

import Header from '../Header';

describe('Test Header Component', () => {
  const minProps = {
    openForm: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<Header {...minProps} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test('Header Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Check whether openUserForm is called when user clicked Add button', () => {
    wrapper.find({ 'aria-label': 'add' }).simulate('click');
    expect(minProps.openForm).toBeCalled();
  });
});
