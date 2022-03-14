import React from 'react';
import { mount } from 'enzyme';

import Container from '../Container';

const t = jest.fn();
test('Container Component renders', () => {
  expect(mount(<Container t={t} />)).toMatchSnapshot();
});
