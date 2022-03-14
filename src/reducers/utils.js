import jwt_decode from 'jwt-decode';

export const permissionListModifier = payload => {
  let userPermissions = [];
  const decoded_data = jwt_decode(payload);
  if ('permissions' in decoded_data) {
    userPermissions = decoded_data['permissions'];
  }
  return userPermissions;
};
