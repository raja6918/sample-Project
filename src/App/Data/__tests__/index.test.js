import React from 'react';
import { shallow } from 'enzyme';

import { Data, Container } from '../Data';

import storage from '../../../utils/storage';

const minProps = {
  t: value => value,
  location: {
    pathname: 'test',
    state: { openItemId: 1, openItemName: 'test', editMode: true },
  },
  match: {
    isExact: true,
    pathname: 'test',
    url: 'test',
  },
};

test('Data component renders', () => {
  const wrapper = shallow(<Data {...minProps} />);

  expect(wrapper).toMatchSnapshot();
  expect(shallow(<Container open={true} />)).toMatchSnapshot();
  expect(shallow(<Container open={false} />)).toMatchSnapshot();

  const open = storage.getItem('openedDataLeftMenu');
  expect(open).toBe(null);
});
