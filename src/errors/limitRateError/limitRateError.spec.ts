import { it, expect } from '@jest/globals';

import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
import { limitRateError } from './limitRateError';

it('should return EmailJSResponseStatus', () => {
  expect(limitRateError()).toBeInstanceOf(EmailJSResponseStatus);
});

it('should return status 451', () => {
  expect(limitRateError()).toEqual({
    status: 429,
    text: 'Too Many Requests',
  });
});
