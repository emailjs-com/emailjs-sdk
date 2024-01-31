import { it, expect } from '@jest/globals';
import { validateBlockListParams } from './validateBlockListParams';

it('should fail on list is invalid type', () => {
  expect(() => validateBlockListParams('100', 'send')).toThrow(
    'The BlockList list has to be an array',
  );
});

it('should fail on watchVariable is invalid type', () => {
  expect(() => validateBlockListParams([], [])).toThrow(
    'The BlockList watchVariable has to be a string',
  );
});

it('should successfully pass the validation', () => {
  expect(() => validateBlockListParams([], 'send')).not.toThrow();
});
