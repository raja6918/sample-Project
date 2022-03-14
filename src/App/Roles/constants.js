export const OrderBy = 'roleName';
export const order = 'inc';
export const type = 'ROLES.type';
export const getHeaders = t => [
  {
    field: 'roleName',
    displayName: t('ROLES.headers.roleName'),
  },
  {
    field: 'roleDescription',
    displayName: t('ROLES.headers.roleDescription'),
  },
];

export const USER_ROLE_NAME_REGEX = '^[a-zA-Z0-9]+$';
