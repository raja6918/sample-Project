import React from 'react';
import { shallow } from 'enzyme';

import DataNotFound from '../DataNotFound';

test('DataNoteFound renders correct', () => {
  const wrapper = shallow(<DataNotFound text={'No users were found'} />);

  expect(wrapper.find('p').text()).toBe('No users were found');
});
