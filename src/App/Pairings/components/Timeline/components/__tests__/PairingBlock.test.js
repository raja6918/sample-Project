import React from 'react';
import { mount } from 'enzyme';
import { PairingBlock } from '..';

const minProps = {
  activity: {
    duration: '1h59',
  },
  hourWidthInPx: 5,
  alertSelected: {
    alertType: 'error',
    flightNumber: 7991,
  },
};

let wrapper;
beforeAll(() => {
  wrapper = mount(<PairingBlock {...minProps} />);
});

afterAll(() => {
  wrapper.unmount();
});

test('PairingBlock Component renders', () => {
  expect(wrapper).toMatchSnapshot();
});
