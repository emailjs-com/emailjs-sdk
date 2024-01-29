import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';

export const blockedEmailError = () => {
  return new EmailJSResponseStatus(403, 'Forbidden');
};
