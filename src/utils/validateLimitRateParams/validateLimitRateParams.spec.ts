import { it, describe, expect } from '@jest/globals';
import { validateLimitRateParams } from './validateLimitRateParams';

describe('should fail on throttle', () => {
  it('is invalid type', () => {
    expect(() => validateLimitRateParams('100')).toThrow(
      'The LimitRate throttle has to be a positive number',
    );
  });

  it('throttle is -1000', () => {
    expect(() => validateLimitRateParams(-1000)).toThrow(
      'The LimitRate throttle has to be a positive number',
    );
  });
});

describe('should fail on ID', () => {
  it('is invalid type', () => {
    expect(() => validateLimitRateParams(1000, 30)).toThrow('The LimitRate ID has to be a string');
  });
});

describe('should successfully pass the validation', () => {
  it('throttle is a positive number', () => {
    expect(() => validateLimitRateParams(1000)).not.toThrow();
  });

  it('ID is string', () => {
    expect(() => validateLimitRateParams(1000, 'app')).not.toThrow();
  });
});
