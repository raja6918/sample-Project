import React from 'react';
import { shallow } from 'enzyme';

import Avatar from '../Avatar';

test('Avatar Component renders a component with first letter in Uppercase', () => {
  const wrapper = shallow(<Avatar firstName="Jose" lastName="Barzza" />);

  expect(wrapper.find('p').text()).toBe('JB');
});
