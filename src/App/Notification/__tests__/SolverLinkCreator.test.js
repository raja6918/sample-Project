import React from 'react';
import { shallow } from 'enzyme';
import { SolverLinkCreator } from '../SolverLinkCreator';

const minProps = {
  href: '/solver/112/3',
  children: [{ props: { value: 'solverName' } }],
};
let wrapper;
describe(`Test suite to test the SolverLinkCreator component`, () => {
  beforeEach(() => {
    wrapper = shallow(<SolverLinkCreator {...minProps} />);
  });
  test('SolverLinkCreator component renders', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
