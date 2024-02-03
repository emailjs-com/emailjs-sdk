import { it, describe, expect, beforeEach } from '@jest/globals';
import { isLimitRateHit } from './isLimitRateHit';
import type { LimitRate } from '../../types/LimitRate';

beforeEach(() => {
  localStorage.clear();
});

describe('limit rate is disabed', () => {
  it('empty limit rate options', () => {
    const limitRate: LimitRate = {};

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();
  });

  it('throttle is 0', () => {
    const limitRate: LimitRate = {
      throttle: 0,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();
  });

  it('no record', () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 1000,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();
  });

  it('no hit limit', async () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();

    await new Promise((r) => setTimeout(r, 150));

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();
  });

  it('not same page or ID', () => {
    const limitRate: LimitRate = {
      throttle: 100,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();

    location.replace('/new-form');

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();
  });
});

describe('limit rate is enabled', () => {
  it('hit limit', () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();
    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeTruthy();
  });

  it('restore after page refresh and hit limit', () => {
    const limitRate: LimitRate = {
      throttle: 100,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();

    location.reload();

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeTruthy();
  });

  it('next page refresh and hit limit', () => {
    const limitRate: LimitRate = {
      id: 'app',
      throttle: 100,
    };

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeFalsy();

    location.replace('/new-form');

    expect(isLimitRateHit(localStorage, location.pathname, limitRate)).toBeTruthy();
  });
});
