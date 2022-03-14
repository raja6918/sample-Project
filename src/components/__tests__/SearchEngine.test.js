import React from 'react';
import { mount } from 'enzyme';

import Search from '../SearchEngine';

test('Search Component renders', () => {
  expect(mount(<Search />)).toMatchSnapshot();
});
