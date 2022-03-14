import React from 'react';
import { shallow } from 'enzyme';
import ModelSelector from '../../../components/ModelSelector';

import UserForm from '../UserForm';

import { evaluateRegex } from './../utils';

const users = [
  {
    id: 1001,
    firstName: 'Ruben',
    lastName: 'Flores',
    userName: 'rubnsom',
    email: 'ruben.flores@kronos.com',
    role: 'Administrator',
  },
  {
    id: 1002,
    firstName: 'Ramon',
    lastName: 'Barraza',
    userName: 'rbarraza',
    email: 'ramon.barraza@kronos.com',
    role: 'Administrator',
  },
];

const t = jest.fn();
const closeUserForm = jest.fn();
const handleUserForm = jest.fn();
const onExited = jest.fn();

const roles = ['Admin', 'Planner', 'Reviewer'];

test('UserForm Component renders', () => {
  const wrapper = shallow(
    <UserForm
      open={true}
      handleCancel={closeUserForm}
      handleOk={handleUserForm}
      t={t}
      onClose={closeUserForm}
      formId={'userForm'}
      roles={roles}
    />
  );

  expect(wrapper).toMatchSnapshot();
});

test.skip('UserForm Component shows filled inputs with correct user', () => {
  const wrapper = shallow(
    <UserForm
      open={true}
      handleCancel={closeUserForm}
      handleOk={handleUserForm}
      t={t}
      onClose={closeUserForm}
      user={users[0]}
      formId={'userForm'}
      roles={roles}
    />
  );

  expect(wrapper.find('[id="firstName"]').prop('defaultValue')).toBe(
    users[0].firstName
  );
  expect(wrapper.find('[id="lastName"]').prop('defaultValue')).toBe(
    users[0].lastName
  );
  expect(wrapper.find('[id="userName"]').prop('defaultValue')).toBe(
    users[0].userName
  );
  expect(wrapper.find('[id="email"]').prop('defaultValue')).toBe(
    users[0].email
  );

  expect(wrapper.find(ModelSelector).prop('selected')).toBe(users[0].role);
});

test('UserForm Component shows Change Password when user prop is received', () => {
  const wrapper = shallow(
    <UserForm
      open={true}
      handleCancel={closeUserForm}
      handleOk={handleUserForm}
      t={t}
      onClose={closeUserForm}
      formId={'userForm'}
      roles={roles}
    />
  );

  expect(wrapper.state('disablePasswordField')).toBe(false);
  expect(wrapper.state('selectedRole')).toBe(false);

  wrapper.setProps({ user: users[0] });
  expect(wrapper.state('disablePasswordField')).toBe(true);

  wrapper.setProps({ user: null });
  expect(wrapper.state('disablePasswordField')).toBe(false);
});

test('state works correct', () => {
  const wrapper = shallow(
    <UserForm
      open={true}
      handleCancel={closeUserForm}
      handleOk={handleUserForm}
      t={t}
      onClose={closeUserForm}
      user={users[0]}
      formId={'userForm'}
      roles={roles}
      onExited={onExited}
    />
  );

  wrapper.instance().checkFormIsReady();
});

test('evaluate Regexp function works correct', () => {
  const wrapper = shallow(
    <UserForm
      open={true}
      handleCancel={closeUserForm}
      handleOk={handleUserForm}
      t={t}
      onClose={closeUserForm}
      user={users[0]}
      formId={'userForm'}
      roles={roles}
      onExited={onExited}
    />
  );

  let isValidName = evaluateRegex('^\\S(.*)\\S', 'Jose');
  expect(isValidName).toBe(true);
  isValidName = evaluateRegex('^\\S(.*)\\S', ' Jose');
  expect(isValidName).toBe(false);
});

test('handleBlur function works as expected', () => {
  const wrapper = shallow(
    <UserForm
      open={true}
      handleCancel={closeUserForm}
      handleOk={handleUserForm}
      t={t}
      onClose={closeUserForm}
      user={users[0]}
      formId={'userForm'}
      roles={roles}
      onExited={onExited}
    />
  );

  const event = {
    target: {
      name: 'email',
      value: ' joe@example',
    },
  };

  const regex = '^[a-zA-Z0-9].*';

  wrapper.instance().handleInputChange(event, regex);
  const isWrongEmail = wrapper.state('errors').email;

  expect(isWrongEmail).toBe(true);
});
