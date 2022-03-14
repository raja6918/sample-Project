import React from 'react';
import { shallow } from 'enzyme';

import TimeRangepicker from '../TimeRangePicker';

const minProps = { onChange: jest.fn(), inputRef: jest.fn() };

test.skip('TimeRangePicker Render', () => {
  expect(shallow(<TimeRangepicker {...minProps} />)).toMatchSnapshot();
});
