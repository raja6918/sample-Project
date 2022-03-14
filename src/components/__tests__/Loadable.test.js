import React from 'react';

import Loadable from '../Loadable';
import User from '../../App/Users';

test('Loadable component behave corrects', () => {
  const AsyncUsers = Loadable({
    loader: () => Users
  });
});
