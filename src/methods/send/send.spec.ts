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

  it('should call the send method and fail on headless', async () => {
    try {
      const result = await send(
        'default_service',
        'my_test_template',
        {},
        {
          publicKey: 'C2JWGTestKeySomething',
          blockHeadless: true,
        },
      );
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toEqual({
        status: 451,
        text: 'Unavailable For Headless Browser',
      });
    }
  });

  it('should call the send method and fail on headless as promise', () => {
    return send('default_service', 'my_test_template', undefined, {
      publicKey: 'C2JWGTestKeySomething',
      blockHeadless: true,
    }).then(
      (result) => {
        expect(result).toBeUndefined();
      },
      (error) => {
        expect(error).toEqual({
          status: 451,
          text: 'Unavailable For Headless Browser',
        });
      },
    );
  });

  it('should call the send method and fail on blocklist', async () => {
    try {
      const result = await send(
        'default_service',
        'my_test_template',
        {
          email: 'bar@emailjs.com',
        },
        {
          publicKey: 'C2JWGTestKeySomething',
          blockList: {
            list: ['foo@emailjs.com', 'bar@emailjs.com'],
            watchVariable: 'email',
          },
        },
      );
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toEqual({
        status: 403,
        text: 'Forbidden',
      });
    }
  });

  it('should call the send method and fail on blocklist as promise', () => {
    return send(
      'default_service',
      'my_test_template',
      {
        email: 'bar@emailjs.com',
      },
      {
        publicKey: 'C2JWGTestKeySomething',
        blockList: {
          list: ['foo@emailjs.com', 'bar@emailjs.com'],
          watchVariable: 'email',
        },
      },
    ).then(
      (result) => {
        expect(result).toBeUndefined();
      },
      (error) => {
        expect(error).toEqual({
          status: 403,
          text: 'Forbidden',
        });
      },
    );
  });

  it('should call the send method and fail on limit rate', async () => {
    const sendEmail = () =>
      send('default_service', 'my_test_template', undefined, {
        publicKey: 'C2JWGTestKeySomething',
        limitRate: {
          id: 'async-send',
          throttle: 100,
        },
      });

    try {
      const result = await sendEmail();
      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }

    try {
      const result = await sendEmail();
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toEqual({
        status: 429,
        text: 'Too Many Requests',
      });
    }
  });

  it('should call the send method and fail on limit rate as promise', () => {
    const sendEmail = () =>
      send('default_service', 'my_test_template', undefined, {
        publicKey: 'C2JWGTestKeySomething',
        limitRate: {
          id: 'promise-send',
          throttle: 100,
        },
      });

    return sendEmail().then(
      (result) => {
        expect(result).toEqual({ status: 200, text: 'OK' });

        return sendEmail().then(
          (result) => {
            expect(result).toBeUndefined();
          },
          (error) => {
            expect(error).toEqual({
              status: 429,
              text: 'Too Many Requests',
            });
          },
        );
      },
      (error) => {
        expect(error).toBeUndefined();
      },
    );
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

  it('should call the send method as promise', () => {
    return send(
      'default_service',
      'my_test_template',
      {},
      {
        publicKey: 'C2JWGTestKeySomething',
      },
    ).then(
      (result) => {
        expect(result).toEqual({ status: 200, text: 'OK' });
      },
      (error) => {
        expect(error).toBeUndefined();
      },
    );
  });
});
