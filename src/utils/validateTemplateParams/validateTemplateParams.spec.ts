import { it, expect } from '@jest/globals';
import { validateTemplateParams } from './validateTemplateParams';

it('should fail on wrong type', () => {
  expect(() => validateTemplateParams('variable')).toThrow(
    'The template params have to be the object.',
  );
  expect(() => validateTemplateParams([])).toThrow('The template params have to be the object.');
});

it('should successfully pass the validation', () => {
  expect(() => validateTemplateParams()).not.toThrow();
  expect(() => validateTemplateParams({})).not.toThrow();
});
