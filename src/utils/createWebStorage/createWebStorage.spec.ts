import { it, expect, beforeAll } from '@jest/globals';
import { createWebStorage } from './createWebStorage';
import type { StorageProvider } from '../../types/StorageProvider';

let storage: StorageProvider;

beforeAll(async () => {
  storage = createWebStorage()!;
  await storage.set('test', 'foo');
});

it('get value', async () => {
  expect(await storage.get('test')).toEqual('foo');
});

it('remove value', async () => {
  await storage.remove('test');
  expect(await storage.get('test')).toEqual(null);
});

it('localStorage is not defined', () => {
  Object.defineProperty(global, 'localStorage', {
    // only returns odd die sides
    get: function () {
      return undefined;
    },
  });
  storage = createWebStorage()!;
  expect(storage).toBeUndefined();
});
