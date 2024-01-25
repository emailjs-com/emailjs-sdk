import { it, expect } from '@jest/globals';
import { validateTemplateParams } from './validateTemplateParams';

it('should fail on wrong type', () => {
  expect(() => validateTemplateParams('variable' as unknown as Record<string, unknown>)).toThrow(
    'The template params have to be the object.',
  );
  expect(() => validateTemplateParams([] as unknown as Record<string, unknown>)).toThrow(
    'The template params have to be the object.',
  );
});

it('should successfully pass the validation', () => {
  expect(() => validateTemplateParams()).not.toThrow();
  expect(() => validateTemplateParams({})).not.toThrow();
});
