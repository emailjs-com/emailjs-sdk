import { it, describe, expect, jest } from '@jest/globals';

import { send } from './send';
import { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';

const responseWrapper = () => {
  return Promise.resolve(new EmailJSResponseStatus(200, 'OK'));
};

jest.mock('../../api/sendPost', () => ({
  sendPost: jest.fn(() => {
    return responseWrapper();
  }),
}));

describe('sdk v3', () => {
  it('should call the send method and fail on the public key', () => {
    expect(() => send('default_service', 'my_test_template')).toThrow('The public key is required');
  });

  it('should call the send method and fail on the service ID', () => {
    expect(() => send('', 'my_test_template', {}, 'C2JWGTestKeySomething')).toThrow(
      'The service ID is required',
    );
  });

  it('should call the send method and fail on the template ID', () => {
    expect(() => send('default_service', '', {}, 'C2JWGTestKeySomething')).toThrow(
      'The template ID is required',
    );
  });

  it('should call the send method successfully with 4 params', async () => {
    try {
      const result = await send('default_service', 'my_test_template', {}, 'C2JWGTestKeySomething');
      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});

describe('sdk v4', () => {
  it('should call the send method and fail on the public key', () => {
    expect(() => send('default_service', 'my_test_template', {}, {})).toThrow(
      'The public key is required',
    );
  });

  it('should call the send method and fail on the service ID', () => {
    expect(() =>
      send('', 'my_test_template', undefined, {
        publicKey: 'C2JWGTestKeySomething',
      }),
    ).toThrow('The service ID is required');
  });

  it('should call the send method and fail on the template ID', () => {
    expect(() =>
      send('default_service', '', undefined, {
        publicKey: 'C2JWGTestKeySomething',
      }),
    ).toThrow('The template ID is required');
  });

  it('should call the send method successfully with 4 params', async () => {
    try {
      const result = await send(
        'default_service',
        'my_test_template',
        {},
        {
          publicKey: 'C2JWGTestKeySomething',
        },
      );
      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});