import React from 'react';
import { mount } from 'enzyme';
import { TimelineRows } from '../';

const minProps = {
  rows: [{}, {}, {}, {}, {}, {}],
  rowsContainerRef: jest.fn(),
};

test.skip('TimelineRows Component renders', () => {
  expect(mount(<TimelineRows {...minProps} />)).toMatchSnapshot();
});
