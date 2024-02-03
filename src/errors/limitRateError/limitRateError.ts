import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';

export const limitRateError = () => {
  return new EmailJSResponseStatus(429, 'Too Many Requests');
};
