import React from 'react';
import { shallow, mount } from 'enzyme';

import Form from '../Form';

const fnCancel = jest.fn();
const fnOk = jest.fn();
const fixture = {
  id: 1,
  title: 'my-title',
  content: 'Content',
  formId: 'form-id',
};

test('Form Component renders', () => {
  const wrapper = shallow(
    <Form
      open={false}
      id={fixture.id}
      formId={fixture.formId}
      title={fixture.title}
      handleCancel={fnCancel}
      modalCommand={true}
      handleOk={fnOk}
    >
      {fixture.content}
    </Form>
  );

  expect(wrapper.find('form').prop('id')).toBe(fixture.formId);
  expect(wrapper.find('form').prop('name')).toBe(fixture.formId);

  expect(
    wrapper
      .find('form')
      .children()
      .at(0)
      .children()
      .text()
  ).toBe('Content');

  wrapper.instance().handleOk();
});

test('Form Component handle submit', () => {
  const wrapper = mount(
    <Form
      open={true}
      id={fixture.id}
      formId={fixture.formId}
      title={fixture.title}
      handleCancel={fnCancel}
      modalCommand={true}
      handleOk={fnOk}
    >
      {fixture.content}
    </Form>
  );

  wrapper.find('form').simulate('submit', {
    target: wrapper
      .find('DialogActions')
      .children()
      .at(0),
  });
});
