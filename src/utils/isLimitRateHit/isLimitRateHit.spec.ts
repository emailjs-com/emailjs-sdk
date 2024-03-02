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
  it('empty limit rate options', () => {
    const limitRate: LimitRate = {};

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('throttle is 0', () => {
    const limitRate: LimitRate = {
      throttle: 0,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('no record', () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 1000,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('no hit limit', async () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    await new Promise((r) => setTimeout(r, 150));

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });

  it('not same page or ID', () => {
    const limitRate: LimitRate = {
      throttle: 100,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    location.replace('/new-form');

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
  });
});

describe('limit rate is enabled', () => {
  it('hit limit', () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();
    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeTruthy();
  });

  it('restore after page refresh and hit limit', () => {
    const limitRate: LimitRate = {
      throttle: 100,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    location.reload();

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeTruthy();
  });

  it('next page refresh and hit limit', () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeFalsy();

    location.replace('/new-form');

    expect(isLimitRateHit(location.pathname, limitRate, storage)).toBeTruthy();
  });
});
