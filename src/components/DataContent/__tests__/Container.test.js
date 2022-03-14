import React from 'react';
import { mount } from 'enzyme';

import Container from '../Container';

test('Container Component renders', () => {
  expect(mount(<Container />)).toMatchSnapshot();
});
