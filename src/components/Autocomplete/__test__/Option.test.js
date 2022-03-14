import React from 'react';
import { shallow } from 'enzyme';

import Option from '../Option';

test('Option component renders', () => {
  const wrapper = shallow(
    <Option
      option={{ value: 'All', label: 'All' }}
      t={jest.fn()}
      onSelect={jest.fn()}
    />
  );

  expect(wrapper).toMatchSnapshot();
  wrapper.instance().handleClick();
});
