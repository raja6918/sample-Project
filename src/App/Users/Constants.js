export const OrderBy = 'firstName';
export const order = 'inc';
export const USER_ROLE_NAME_REGEX = '^[a-zA-Z0-9].*';

export const ENTITY_FIELDS = [
  'firstName',
  'lastName',
  'userName',
  'email',
  'password',
  'role',
  'roleId',
];

export const getDefaultEntity = () => ({
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  role: '',
  roleId: '',
});

export const RegExs = {
  firstName: '^[a-zA-Z0-9].*',
  lastName: '^[a-zA-Z0-9].*',
  userName: '^(?=.*?[A-Za-z])(([a-zA-Z0-9])+([_\\-.]{0,1}))+[a-zA-Z0-9]+$',
  email: '^[a-zA-Z0-9].*',
  password: '',
};

export const getHeaders = t => [
  {
    field: 'firstName',
    displayName: t('USERS.headers.firstName'),
  },
  {
    field: 'lastName',
    displayName: t('USERS.headers.lastName'),
  },
  {
    field: 'userName',
    displayName: t('USERS.headers.userName'),
  },
  {
    field: 'role',
    displayName: t('USERS.headers.role'),
  },
];

export const type = 'USERS.type';
