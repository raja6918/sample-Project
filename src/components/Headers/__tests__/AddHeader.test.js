import React from 'react';
import { shallow } from 'enzyme';

import AddHeader from '../AddHeader';

const t = jest.fn();

test('AddHeader Component renders', () => {
  expect(
    shallow(
      <AddHeader t={t} name={'Stations'} scenarioName={'Scenario test'} />
    )
  ).toMatchSnapshot();
});
