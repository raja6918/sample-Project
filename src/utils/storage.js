const storageType = window.sessionStorage;
const localStorageType = window.localStorage;

const storage = {
  length: () => storageType.length,
  clear: storageType.clear,
  key: storageType.key,
  removeItem: key => storageType.removeItem(key),
  getItem: key => JSON.parse(storageType.getItem(key)),
  setItem: (key, value) => storageType.setItem(key, JSON.stringify(value)),
};

export const localStorage = {
  length: () => localStorageType.length,
  clear: localStorageType.clear,
  key: localStorageType.key,
  removeItem: key => localStorageType.removeItem(key),
  getItem: key => JSON.parse(localStorageType.getItem(key)),
  setItem: (key, value) => localStorageType.setItem(key, JSON.stringify(value)),
};

export default storage;
