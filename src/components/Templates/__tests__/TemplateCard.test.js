import React from 'react';
import { shallow } from 'enzyme';

import TemplateCard from '../TemplateCard';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { user } from '../../../reducers/__mocks__/store';

const mockStore = configureMockStore();
const store = mockStore({
  user,
});

const t = jest.fn();

const template = {
  id: '6',
  name: 'Blank',
  category: 'Pairing',
  createdBy: 'AD OPT',
  lastModified: '2018-05-21T08:30:00.586Z',
  status: 'FREE',
};

test('TemplateCard Render', () => {
  expect(
    shallow(
      <Provider store={store}>
        <TemplateCard t={t} template={template} />
      </Provider>
    ).dive()
  ).toMatchSnapshot();
});
