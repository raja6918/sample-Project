import React from 'react';
import { mount } from 'enzyme';
import { PairingLabels } from '..';

const minProps = {
  activity: {
    station: 'STA',
    duration: '1h59',
  },
};

test('PairingLabels Component renders', () => {
  expect(mount(<PairingLabels {...minProps} />)).toMatchSnapshot();
});
