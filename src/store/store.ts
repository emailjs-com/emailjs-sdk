import type { Options } from '../types/Options';
import { createWebStorage } from '../utils/createWebStorage/createWebStorage';

export const store: Options = {
  origin: 'https://api.emailjs.com',
  blockHeadless: false,
  storageProvider: createWebStorage(),
};
