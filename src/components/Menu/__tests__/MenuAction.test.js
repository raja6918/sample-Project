import React from 'react';
import { shallow } from 'enzyme';

import MenuAction from '../MenuAction';

test('MenuItem Component renders', () => {
  expect(
    shallow(
      <MenuAction handleClick={jest.fn()} icon={'icon'} text={'test text'} />
    )
  ).toMatchSnapshot();
});
