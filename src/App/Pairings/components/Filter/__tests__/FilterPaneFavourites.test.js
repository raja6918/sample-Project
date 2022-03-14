import React from 'react';
import { shallow } from 'enzyme';
import FilterPaneFavourites from '../FilterPaneFavourites';

describe('Test FilterPaneFavourites Component', () => {
  const minProps = {
    t: jest.fn(),
    enableSave: true,
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<FilterPaneFavourites {...minProps} />);
  });

  test('FilterPaneFavourites Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
