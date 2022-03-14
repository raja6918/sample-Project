import React from 'react';
import { shallow } from 'enzyme';

import FormBody from '../FormBody';

test('FormBody Component renders', () => {
  expect(shallow(<FormBody />)).toMatchSnapshot();
});
