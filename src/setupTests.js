import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jest-styled-components';
import 'jest-localstorage-mock';

configure({ adapter: new Adapter() });

jest.mock('react-i18next', () => ({
  translate: () => Component => props => <Component t={() => ''} {...props} />,
}));

jest.mock('i18next', () => ({
  t: jest.fn(),
}));

jest.mock('./utils/analytics');
