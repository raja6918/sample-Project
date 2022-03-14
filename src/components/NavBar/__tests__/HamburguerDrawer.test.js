import React from 'react';
import { shallow } from 'enzyme';

import { HamburgerDrawer } from '../HamburgerDrawer';
import { user } from '../../../reducers/__mocks__/store';

const t = jest.fn();

test('HamburguerDrawer component reders correct', () => {
  const wrapper = shallow(
    <HamburgerDrawer t={t} userPermissions={user.permissions} />
  );
  expect(wrapper).toMatchSnapshot();
});
