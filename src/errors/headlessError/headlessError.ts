import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';

export const headlessError = () => {
  return new EmailJSResponseStatus(451, 'Unavailable For Headless Browser');
};
