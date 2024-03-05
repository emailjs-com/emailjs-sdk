import { it, describe, expect, beforeEach, beforeAll } from '@jest/globals';
import type { LimitRate } from '../../types/LimitRate';
import type { StorageProvider } from '../../types/StorageProvider';
import { isLimitRateHit } from './isLimitRateHit';
import { createWebStorage } from '../createWebStorage/createWebStorage';

let storage: StorageProvider;

beforeAll(() => {
  storage = createWebStorage()!;
});

beforeEach(() => {
  localStorage.clear();
});

describe('limit rate is disabed', () => {
  it('empty limit rate options', async () => {
    const limitRate: LimitRate = {};

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('throttle is 0', async () => {
    const limitRate: LimitRate = {
      throttle: 0,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('no record', async () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 1000,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('no hit limit', async () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    await new Promise((r) => setTimeout(r, 150));

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('not same page or ID', async () => {
    const limitRate: LimitRate = {
      throttle: 100,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    location.replace('/new-form');

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });
});

describe('limit rate is enabled', () => {
  it('hit limit', async () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeTruthy();
  });

  it('restore after page refresh and hit limit', async () => {
    const limitRate: LimitRate = {
      throttle: 100,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    location.reload();

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeTruthy();
  });

  it('next page refresh and hit limit', async () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    location.replace('/new-form');

    expect(await isLimitRateHit(location.pathname, limitRate, storage)).toBeTruthy();
  });
});
