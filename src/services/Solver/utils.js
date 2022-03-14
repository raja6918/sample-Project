import storage from '../../utils/storage';

export const buildBulkRequestDataParam = dataToBulk => {
  const objects = Array.isArray(dataToBulk) ? dataToBulk : [dataToBulk];

  return { objects };
};

export const buildBulkDeleteRequestDataParam = dataToBulk => {
  return Array.isArray(dataToBulk) ? dataToBulk : [dataToBulk];
};

export const getUserId = () => {
  const loggedUser = storage.getItem('loggedUser');

  if (loggedUser && !!loggedUser.id) return loggedUser.id;

  return null;
};
