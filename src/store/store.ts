import type { Options } from '../types/Options.js';
import { createWebStorage } from '../utils/createWebStorage/createWebStorage.js';

export const store: Options = {
  origin: 'https://api.emailjs.com',
  blockHeadless: false,
  storageProvider: createWebStorage(),
};
