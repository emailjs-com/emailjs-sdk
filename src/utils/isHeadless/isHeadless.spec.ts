import { it, expect } from '@jest/globals';
import { isHeadless } from './isHeadless';

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
