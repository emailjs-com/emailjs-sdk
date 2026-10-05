import { it, expect } from 'vitest';
import { isHeadless } from './isHeadless.js';

it('should be headless browser', () => {
  expect(isHeadless(navigator)).toBeTruthy();
});

it('should be headless browser without languages', () => {
  expect(
    isHeadless({
      webdriver: false,
    } as Navigator),
  ).toBeTruthy();
});

it('should be headfull browser', () => {
  expect(
    isHeadless({
      webdriver: false,
      languages: ['un'],
    } as unknown as Navigator),
  ).toBeFalsy();
});
