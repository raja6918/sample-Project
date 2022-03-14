import React from 'react';
import { shallow } from 'enzyme';

import FormHeader from '../FormHeader';

test('FormHeader Component renders', () => {
  expect(shallow(<FormHeader />)).toMatchSnapshot();
});
