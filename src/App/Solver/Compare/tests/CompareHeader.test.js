import React from 'react';
import { mount } from 'enzyme';

import CompareHeader from '../CompareHeader';

const fn = jest.fn();

const Wrapper = mount(
  <CompareHeader
    title={'Compare Solvers Title'}
    buttonLabel={'Save'}
    columnValue={'hotelRooms'}
    kpiValue={1}
    handleChangeColumn={fn}
    crewbases={['LND']}
    t={fn}
  />
);

test.skip('Compare component renders without crash', () => {
  expect(Wrapper).toMatchSnapshot();
});
