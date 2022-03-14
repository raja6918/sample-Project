import React from 'react';
import { shallow } from 'enzyme';

import TemplatesForm from '../TemplatesForm';

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
test.skip('Form component renders', () => {
  const wrapper = shallow(
    <TemplatesForm
      open={false}
      handleCancel={jest.fn()}
      handleOk={jest.fn()}
      formId={'templateForm'}
      t={jest.fn()}
      onClose={jest.fn()}
      okButton={'CREATE'}
      cancelButton={'CANCEL'}
      templateSuggestions={TemplatesSuggestions}
      categories={categories}
    />
  );

  expect(wrapper).toMatchSnapshot();
});
