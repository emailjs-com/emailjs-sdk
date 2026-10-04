import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';

export const limitRateError = () => {
  return new EmailJSResponseStatus(429, 'Too Many Requests');
};
