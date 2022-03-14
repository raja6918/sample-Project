import React from 'react';
import { shallow } from 'enzyme';

import AutoComplete from '../AutoComplete';

const TemplatesSuggestions = [
  { value: 1, label: 'Template 1' },
  { value: 2, label: 'Template 2' },
  { value: 3, label: 'Template 3' },
  { value: 4, label: 'Template 4' },
];

const categories = [
  { value: 'Category 1', label: 'Category 1' },
  { value: 'Category 2', label: 'Category 2' },
  { value: 'Category 3', label: 'Category 3' },
];
test.skip('AutoComplete component renders', () => {
  const wrapperRegular = shallow(
    <AutoComplete
      id={'sourceTemplate'}
      name={'sourceTemplate'}
      placeholder={'Template Name'}
      suggestions={TemplatesSuggestions}
      create={false}
      required
      t={jest.fn()}
    />
  );
  wrapperRegular.state({ value: '' });
  wrapperRegular.instance().handleChange('value', 'new');

  expect(wrapperRegular).toMatchSnapshot();
  wrapperRegular.instance().handleChange('New template');
  const wrapperCreate = shallow(
    <AutoComplete
      id={'category'}
      name={'category'}
      placeholder={'Category'}
      suggestions={categories}
      create={true}
      createLabel={'Create category'}
      t={jest.fn()}
      maxLength={100}
      defaultValue={''}
    />
  );

  expect(wrapperCreate).toMatchSnapshot();
});
