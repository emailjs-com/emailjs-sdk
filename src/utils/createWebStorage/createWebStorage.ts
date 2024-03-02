import type { StorageProvider } from '../../types/StorageProvider';

export const createWebStorage = (): StorageProvider | undefined => {
  if (typeof localStorage === 'undefined') return;

  return {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
  };
};
