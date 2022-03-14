import React from 'react';
import { mount } from 'enzyme';

import AppTitle from '../AppTitle';

const t = jest.fn();
test('AppTitle Component renders', () => {
  expect(mount(<AppTitle t={t} />)).toMatchSnapshot();
});
