import { it, expect } from '@jest/globals';

import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';
import { blockedEmailError } from './blockedEmailError.js';

it('should return EmailJSResponseStatus', () => {
  expect(blockedEmailError()).toBeInstanceOf(EmailJSResponseStatus);
});

it('should return status 403', () => {
  expect(blockedEmailError()).toEqual({
    status: 403,
    text: 'Forbidden',
  });
});
