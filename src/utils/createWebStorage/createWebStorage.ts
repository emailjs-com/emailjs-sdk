import type { StorageProvider } from '../../types/StorageProvider';

export const createWebStorage = (): StorageProvider | undefined => {
  if (typeof localStorage === 'undefined') return;

  return {
    get: (key) => Promise.resolve(localStorage.getItem(key)),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    remove: (key) => Promise.resolve(localStorage.removeItem(key)),
  };
};
