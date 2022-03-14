import React from 'react';
import { mount } from 'enzyme';
import Scenario from '../';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { user } from '../../../reducers/__mocks__/store';

const mockStore = configureMockStore();
const store = mockStore({
  user,
});

const minProps = { t: jest.fn(), reportError: jest.fn() };

const wrapper = mount(
  <Provider store={store}>
    <Scenario {...minProps} />
  </Provider>
);

test('Scenarios component render without crashing', () => {
  expect(wrapper).toMatchSnapshot();
});
