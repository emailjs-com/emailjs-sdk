import { it, expect } from 'vitest';

import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';
import { limitRateError } from './limitRateError.js';

it('should return EmailJSResponseStatus', () => {
  expect(limitRateError()).toBeInstanceOf(EmailJSResponseStatus);
});

it('should return status 429', () => {
  expect(limitRateError()).toEqual({
    status: 429,
    text: 'Too Many Requests',
  });
});
