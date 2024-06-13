import { it, expect, describe } from '@jest/globals';
import { validateParams } from './validateParams';

describe('should fail on the public key', () => {
  it('no key', () => {
    expect(() => validateParams('', 'default_service', 'my_test_template')).toThrow(
      'The public key is required',
    );
  });

  it('invalid type', () => {
    expect(() => validateParams({}, 'default_service', 'my_test_template')).toThrow(
      'The public key is required',
    );
  });
});

describe('should fail on the service ID', () => {
  it('no key', () => {
    expect(() => validateParams('d2JWGTestKeySomething', '', 'my_test_template')).toThrow(
      'The service ID is required',
    );
  });

  it('invalid type', () => {
    expect(() => validateParams('d2JWGTestKeySomething', [], 'my_test_template')).toThrow(
      'The service ID is required',
    );
  });
});

describe('should fail on the template ID', () => {
  it('no key', () => {
    expect(() => validateParams('d2JWGTestKeySomething', 'default_service', '')).toThrow(
      'The template ID is required',
    );
  });

  it('invalid type', () => {
    expect(() => validateParams('d2JWGTestKeySomething', 'default_service', 3)).toThrow(
      'The template ID is required',
    );
  });
});

it('should successfully pass the validation', () => {
  expect(() =>
    validateParams('d2JWGTestKeySomething', 'default_service', 'my_test_template'),
  ).not.toThrow();
});
