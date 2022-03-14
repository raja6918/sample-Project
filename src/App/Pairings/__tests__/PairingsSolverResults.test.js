import React from 'react';
import { shallow } from 'enzyme';
import PairingsSolverResults from '../index';
import storage from './../../../utils/storage';
import mockedScenario from './mockedScenario.mock';

const minProps = {
  location: {},
  t: jest.fn(),
};

afterEach(() => {
  storage.clear();
});

test('PairingsSolverResults Component renders', () => {
  storage.setItem('openScenario', mockedScenario);
  expect(shallow(<PairingsSolverResults {...minProps} />)).toMatchSnapshot();
});
