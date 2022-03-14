import React from 'react';
import { mount, shallow } from 'enzyme';

import { Users } from '../Users';
import storage from '../../../utils/storage';

import usersService from '../../../services/Users';

jest.mock('../../../services/Users');
jest.mock('../../../utils/storage');

const minProps = {
  t: jest.fn(),
};

const ROLES = [];

const USER = {
  id: 10,
  firstName: 'test firstName',
  lastName: 'test lastName',
  userName: 'testusername',
  email: 'test@kronos.com',
  role: 'Administrator',
};
const USERS = [USER];

beforeEach(() => {
  usersService.getUsers.mockImplementation(() => Promise.resolve(USERS));

  usersService.deleteUser.mockImplementation(() => Promise.resolve());

  usersService.updateUser.mockImplementation(data => Promise.resolve(data));

  usersService.getRoles.mockImplementation(() => Promise.resolve(ROLES));

  usersService.createUser.mockImplementation(data => Promise.resolve([data]));

  usersService.getUserDetails.mockImplementation(() => Promise.resolve(USER));

  storage.getItem.mockImplementation(() => USER);
});

afterEach(() => {
  Object.keys(usersService).forEach(method => {
    usersService[method].mockReset();
  });

  storage.getItem.mockReset();
});

afterAll(() => {
  Object.keys(usersService).forEach(method => {
    usersService[method].mockRestore();
  });

  storage.getItem.mockRestore();
});

test('Users Component renders the correct users', () => {
  const wrapper = shallow(<Users />);

  expect(wrapper.state()).toMatchObject({
    users: [],
    roles: [],
    userFormIsOpen: false,
    deleteDialogIsOpen: false,
    isUsersEmpty: false,
  });

  Promise.all([usersService.getUsers(), usersService.getRoles()]).then(
    ([users, roles]) => {
      const wrapper = shallow(<Users />);
      expect(wrapper.state('users')).toEqual(expect.arrayContaining(users));
      expect(wrapper.state('roles')).toEqual(expect.arrayContaining(roles));

      usersService.updateUser(USER).then(() => {
        wrapper.update();
        expect(
          wrapper
            .state('users')
            .length()
            .toBe(length)
        );
      });

      usersService.deleteUser('testusername').then(() => {
        wrapper.update();
        expect(
          wrapper
            .state('users')
            .length()
            .toBe(length - 1)
        );
      });
    }
  );
});

test('open and close dialogs and forms', () => {
  const wrapper = shallow(<Users />);
  wrapper.instance().openDeleteDialog(USER, 1);
  expect(wrapper.state('userToDelete')).toBe(USER);

  wrapper.instance().closeDeleteDialog();
  expect(wrapper.state('deleteDialogIsOpen')).toBe(false);

  wrapper.instance().openUserForm(true);
  expect(wrapper.state('userToEdit')).toBeUndefined();
  expect(wrapper.state('userFormIsOpen')).toBe(true);

  wrapper.instance().closeUserForm();
  expect(wrapper.state('userFormIsOpen')).toBe(false);
});

test('should open edit dialog', async () => {
  const wrapper = shallow(<Users {...minProps} />);
  await wrapper.instance().openEditDialog(USER);
  expect(usersService.getUserDetails.mock.calls.length).toEqual(1);
  expect(wrapper.instance().state.userToEdit).toBe(USER);
});

test('check whether addUser calls createUser service and update user state', async () => {
  const wrapper = shallow(<Users {...minProps} />);

  expect(wrapper.state('users')).toEqual([]);

  await wrapper.instance().addUser(USER);

  expect(usersService.createUser).toBeCalled();
  expect(wrapper.state('users')).toEqual([USER]);
});

test('check whether editUser calls updateUser service', async () => {
  const wrapper = shallow(<Users {...minProps} />);
  await wrapper.instance().editUser(USER, USER.id);
  expect(usersService.updateUser).toBeCalled();
});
