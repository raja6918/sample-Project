import React from 'react';
import { mount } from 'enzyme';

import SaveAsTemplateForm from '../SaveAsTemplateForm';

const minProps = {
  open: false,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
  t: jest.fn(),
  formId: 'saveAsTemplateForm',
  onClose: jest.fn(),
  scenario: 'Scenario Name',
  okButton: 'Ok',
  cancelButton: 'Cancel',
};

const wrapper = mount(<SaveAsTemplateForm {...minProps} />);

test('SaveAsTemplateForm renders without crashing', () => {
  expect(wrapper).toMatchSnapshot();
});

test('onChange name function changes the template name correct', () => {
  const e = {
    target: {
      name: 'templateName',
      value: 'New template name',
    },
  };
  wrapper.instance().onChange(e);
  const templateName = wrapper.state('templateName');
  expect(templateName).toBe('New template name');
});

test('willReceiveProps sets templateName to empty', () => {
  wrapper.setProps({ open: true });
  const templateName = wrapper.state('templateName');
  expect(templateName).toBe('');
});
