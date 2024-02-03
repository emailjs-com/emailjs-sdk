import { it, expect } from '@jest/globals';
import { buildOptions } from './buildOptions';

it('get empty object', () => {
  expect(buildOptions()).toEqual({});
});

it('get options object for SDK 3 interface', () => {
  expect(buildOptions('public-key')).toEqual({
    publicKey: 'public-key',
  });
});

it('get options object', () => {
  expect(
    buildOptions({
      publicKey: 'public-key',
    }),
  ).toEqual({
    publicKey: 'public-key',
  });
});

it('get empty object with wrong type of options', () => {
  expect(buildOptions([] as unknown as string)).toEqual({});
});
