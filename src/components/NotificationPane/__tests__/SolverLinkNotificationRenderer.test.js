import React from 'react';
import { shallow } from 'enzyme';
import { SolverNotificationLinkRender } from '../SolverNotificationLinkRenderer';

const minProps = {
  href: '/solver/112/3',
  children: [{ props: { value: 'test' } }],
  closeNotificationBar: jest.fn(),
};
let wrapper;

jest.mock('i18next', () => ({
  init: () => {},
  t: k => k,
}));

describe(`Test suite for SolverNotificationLinkRender component`, () => {
  beforeEach(() => {
    wrapper = shallow(<SolverNotificationLinkRender {...minProps} />);
  });
  test(`SolverNotificationLinkRender component renders`, () => {
    expect(wrapper).toMatchSnapshot();
  });
});
