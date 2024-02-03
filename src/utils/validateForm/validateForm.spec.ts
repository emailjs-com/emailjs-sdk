import { it, expect } from '@jest/globals';
import { validateForm } from './validateForm';

it('should throw non-form element error', () => {
  const form: HTMLFormElement = document.createElement('span') as HTMLFormElement;

  expect(() => validateForm(form)).toThrow(
    'The 3rd parameter is expected to be the HTML form element or the style selector of the form',
  );
});

it('should throw error for null', () => {
  expect(() => validateForm(null)).toThrow(
    'The 3rd parameter is expected to be the HTML form element or the style selector of the form',
  );
});

it('should sucefully validate the form element', () => {
  const form: HTMLFormElement = document.createElement('form');

  expect(() => validateForm(form)).not.toThrow();
});
