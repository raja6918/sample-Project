import React from 'react';
import { shallow } from 'enzyme';

import ErrorMessage from '../ErrorMessage';

test('ErrorMessage Component renders', () => {
  expect(shallow(<ErrorMessage />)).toMatchSnapshot();
});
