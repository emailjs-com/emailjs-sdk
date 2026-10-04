import { it, expect } from '@jest/globals';

import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';
import { headlessError } from './headlessError.js';

it('should return EmailJSResponseStatus', () => {
  expect(headlessError()).toBeInstanceOf(EmailJSResponseStatus);
});

it('should return status 451', () => {
  expect(headlessError()).toEqual({
    status: 451,
    text: 'Unavailable For Headless Browser',
  });
});
