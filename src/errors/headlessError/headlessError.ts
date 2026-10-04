import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';

export const headlessError = () => {
  return new EmailJSResponseStatus(451, 'Unavailable For Headless Browser');
};
