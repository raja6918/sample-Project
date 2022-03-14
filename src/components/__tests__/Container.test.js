import React from 'react';
import { mount } from 'enzyme';

import Container from '../Container';

test('Container Component renders', () => {
  expect(mount(<Container />)).toMatchSnapshot();
  expect(mount(<Container margin={'70px auto'} />)).toMatchSnapshot();
  expect(mount(<Container margin={'10px 20px 30px 40px'} />)).toMatchSnapshot();
  expect(mount(<Container margin={'1em'} />)).toMatchSnapshot();
});
