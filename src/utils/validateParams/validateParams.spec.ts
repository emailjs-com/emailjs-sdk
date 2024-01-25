import { it, expect } from '@jest/globals';
import { validateParams } from './validateParams';

it('should fail on the public key', () => {
  expect(() => validateParams('', 'default_service', 'my_test_template')).toThrow(
    'The public key is required',
  );
});

it('should fail on the service ID', () => {
  expect(() => validateParams('d2JWGTestKeySomething', '', 'my_test_template')).toThrow(
    'The service ID is required',
  );
});

it('should fail on the template ID', () => {
  expect(() => validateParams('d2JWGTestKeySomething', 'default_service', '')).toThrow(
    'The template ID is required',
  );
});

it('should successfully pass the validation', () => {
  expect(() =>
    validateParams('d2JWGTestKeySomething', 'default_service', 'my_test_template'),
  ).not.toThrow();
});
