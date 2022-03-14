import storage from './storage';

const storageKeys = ['openPreview', 'openPairingDetails'];

export const redirectURL = pathname => {
  for (const storageKey of storageKeys) {
    const item = storage.getItem(storageKey);
    if (item && pathname !== item.pathname) {
      return item.pathname;
    }
  }

  return null;
};
