import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';

export const blockedEmailError = () => {
  return new EmailJSResponseStatus(403, 'Forbidden');
};
