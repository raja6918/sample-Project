import React from 'react';
import { shallow } from 'enzyme';

import CommercialFlights from '../Content/CommercialFlights';

const t = jest.fn();

test('CommercialFlights component render correct', () => {
  const wrapper = shallow(<CommercialFlights t={t} />);

  expect(wrapper).toMatchSnapshot();
});
