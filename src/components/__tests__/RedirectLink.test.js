import React from 'react';
import { shallow } from 'enzyme';

import RedirectLink from '../RedirectLink';

test('RedirectLink Component renders without crashing', () => {
  const wrapper = shallow(<RedirectLink to={'/test/path'} />);

  expect(wrapper).toMatchSnapshot();
});
