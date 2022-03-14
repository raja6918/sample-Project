import React from 'react';
import { shallow } from 'enzyme';

import Loading from '../Loading';

test('Loading Component renders a component', () => {
  const wrapper = shallow(<Loading />);

  expect(wrapper.find('Overlay').find('LoadingPage'));
});
