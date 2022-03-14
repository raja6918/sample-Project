import React from 'react';
import { mount } from 'enzyme';

import Icon from '../Icon';

test('Icon component renders correct', () => {
  expect(mount(<Icon />)).toMatchSnapshot();
  expect(
    mount(<Icon margin={'0 0 0 8px'} iconcolor={'#0A75C2'} />)
  ).toMatchSnapshot();
  expect(mount(<Icon margin={'0 0 0 8px'} />)).toMatchSnapshot();
  expect(mount(<Icon iconcolor={'#0A75C2'} />)).toMatchSnapshot();
});
