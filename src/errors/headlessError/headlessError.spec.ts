import { it, expect } from '@jest/globals';

import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
import { headlessError } from './headlessError';

it('should return EmailJSResponseStatus', () => {
  expect(headlessError()).toBeInstanceOf(EmailJSResponseStatus);
});

it('should return status 451', () => {
  expect(headlessError()).toEqual({
    status: 451,
    text: 'Unavailable For Headless Browser',
  });
});
