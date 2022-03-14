import React from 'react';
import { shallow, mount } from 'enzyme';

import Button from '@material-ui/core/Button';

import Form from '../Form';

const t = jest.fn().mockReturnValue('string');
const onSubmit = jest.fn();
const clearErrorMessage = jest.fn();
const errorMessage = 'Error Message Text';

test('Form Component renders', () => {
  const wrapper = shallow(
    <Form
      handleSubmit={onSubmit}
      t={t}
      errorMessage={errorMessage}
      clearErrorMessage={clearErrorMessage}
    />
  );

  const form = wrapper.children().children();
  expect(form).toHaveLength(5);

  const userInput = form.at(1);
  expect(userInput.prop('id')).toBe('username');
  expect(userInput.prop('name')).toBe('username');

  const passwordInput = form.at(2);
  expect(passwordInput.prop('id')).toBe('password');
  expect(passwordInput.prop('name')).toBe('password');

  const button = form.at(4);
  expect(button.prop('type')).toBe('submit');
});

test('Form Component handle submit', () => {
  const wrapper = mount(
    <Form
      handleSubmit={onSubmit}
      t={t}
      errorMessage={errorMessage}
      clearErrorMessage={clearErrorMessage}
    />
  );

  wrapper.find('form').simulate('submit', {
    target: wrapper
      .find(Button)
      .children()
      .at(0),
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
