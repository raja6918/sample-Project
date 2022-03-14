import React from 'react';
import { mount } from 'enzyme';

import MenuItem from '../MenuItem';

test('MenuItem Component renders', () => {
  expect(mount(<MenuItem />)).toMatchSnapshot();
});
