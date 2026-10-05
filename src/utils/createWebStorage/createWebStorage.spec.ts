import { it, expect, beforeAll, vi } from 'vitest';
import { createWebStorage } from './createWebStorage.js';
import type { StorageProvider } from '../../types/StorageProvider.js';

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
  vi.stubGlobal('localStorage', undefined);
  storage = createWebStorage()!;
  expect(storage).toBeUndefined();
  vi.unstubAllGlobals();
});
