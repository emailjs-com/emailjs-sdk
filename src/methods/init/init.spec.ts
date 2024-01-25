import { it, describe, expect, beforeEach } from '@jest/globals';

import { init } from './init';
import { store } from '../../store/store';

beforeEach(() => {
  store.origin = 'https://api.emailjs.com';
  store.limitRate = 0;
  store.blockList = [];
  store.publicKey = undefined;
});

describe('sdk v3', () => {
  it('should call the init method with options as the public key', () => {
    init('C2JWGTestKeySomething');

    expect(store).toEqual({
      origin: 'https://api.emailjs.com',
      publicKey: 'C2JWGTestKeySomething',
      limitRate: 0,
      blockList: [],
    });
  });
});

describe('sdk v4', () => {
  it('should call the init method with empty options and get default values', () => {
    init('');

    expect(store).toEqual({
      origin: 'https://api.emailjs.com',
      limitRate: 0,
      blockList: [],
    });
  });

  it('should call the init method with custom options', () => {
    init({
      publicKey: 'C2JWGTestKeySomething',
      blockList: ['block@email.com'],
      limitRate: 10000,
    });

    expect(store).toEqual({
      origin: 'https://api.emailjs.com',
      publicKey: 'C2JWGTestKeySomething',
      blockList: ['block@email.com'],
      limitRate: 10000,
    });
  });
});
