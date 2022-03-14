import React from 'react';
import { mount } from 'enzyme';
import GenericTextField from '../GenericTextField';

const props = {
  onBlur: jest.fn(),
  value: 'solver title',
  readOnly: false,
  id: 'activeRequestName',
};

test.skip('Generic Test Component renders', () => {
  expect(mount(<GenericTextField {...props} />)).toMatchSnapshot();
});
