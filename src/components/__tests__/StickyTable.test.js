import React from 'react';
import { shallow, mount } from 'enzyme';

import StickyTable from '../StickyTable';

const props = {
  data: [
    {
      id: 1,
      statistics: 'Hotel Rooms',
      total: 1000,
      columnX: 'test 1',
      columnY: 'test 1',
      delete: <button type="button">test 1</button>,
    },
    {
      id: 2,
      statistics: 'Aircrafts',
      total: 345,
      columnX: '',
      columnY: 'test2',
      delete: <button type="button">test 2</button>,
    },
  ],
  headers: [
    {
      id: 'statistics',
      name: 'Statistics',
      sticky: true,
    },
    {
      id: 'total',
      name: 'Total',
    },
    {
      id: 'columnX',
      name: 'Test Column X',
    },
    {
      id: 'columnY',
    },
    {
      id: 'delete',
      component: <button type="button">TEST</button>,
      sticky: true,
    },
  ],
  stickyLeft: 1,
  stickyRight: 1,
};

test('StickyTable renders without crashing', () => {
  const wrapper = mount(<StickyTable {...props} />);

  expect(wrapper).toMatchSnapshot();
});
