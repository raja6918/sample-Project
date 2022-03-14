import React from 'react';
import { shallow } from 'enzyme';

import storage from '../../../utils/storage';

import { Home } from '../Home';

jest.mock('../../../utils/storage');

const minProps = {
  t: jest.fn(),
  openItemName: 'openItem Test',
  path: '/data',
  openItemId: '1001',
  cards: [],
  importProcess: [],
  isFetching: false,
  setIsFetching: () => {},
  userData: { id: 1 },
};
const wrapper = shallow(<Home {...minProps} />);

const mockStorage = {
  openScenario: {
    startDate: Date.now(),
    endDate: Date.now(),
  },
  loggedUser: {
    id: '1',
  },
};

describe('Home Component', () => {
  let mock;

  function clearMock() {
    if (mock) mock.mockReset();
  }
  beforeAll(clearMock);

  afterAll(() => mock.restore());

  beforeEach(() => {
    mock = storage.getItem.mockImplementation(key => mockStorage[key]);
  });

  afterEach(clearMock);

  test('Home component renders correct', () => {
    expect(wrapper).toMatchSnapshot();

    const emptyCells = wrapper.state().emptyCells.length;
    expect(emptyCells).toBe(0);

    wrapper.setState({ emptyCells: [{}, {}] });

    wrapper.instance().forceUpdate();

    wrapper.unmount();
  });

  test('Header name to match with selected openItem name', () => {
    const wrapper = shallow(<Home {...minProps} />);
    expect(
      wrapper
        .find('Connect(AccessEnabler)')
        .at(0)
        .renderProp('render')({ disableComponent: false })
        .find('span')
        .text()
    ).toEqual(minProps.openItemName + ' ');
  });
});
