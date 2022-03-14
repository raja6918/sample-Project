import React from 'react';
import { mount } from 'enzyme';

import MenuText from '../MenuItem';

test('MenuText Component renders', () => {
  expect(mount(<MenuText>Example Text</MenuText>)).toMatchSnapshot();
});
