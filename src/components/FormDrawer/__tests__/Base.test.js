import React from 'react';
import { shallow } from 'enzyme';

import Base from '../Base';

const fnCancel = jest.fn();

test('Base Component renders', () => {
  const wrapper = shallow(
    <Base isOpen={true} handleCancel={fnCancel} anchor={'right'} />
  );
  wrapper.instance().props.handleCancel();
  expect(wrapper.instance().props.isOpen).toBe(true);
});
