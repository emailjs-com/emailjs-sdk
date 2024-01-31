import { it, describe, expect, jest } from '@jest/globals';

import { sendForm } from './sendForm';
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
  it('should call the sendForm method and fail on the public key', () => {
    expect(() => sendForm('default_service', 'my_test_template', '#form-id')).toThrow(
      'The public key is required',
    );
  });

  it('should call the sendForm method and fail on the service ID', () => {
    expect(() => sendForm('', 'my_test_template', '#form-id', 'C2JWGTestKeySomething')).toThrow(
      'The service ID is required',
    );
  });

  it('should call the sendForm method and fail on the template ID', () => {
    expect(() => sendForm('default_service', '', '#form-id', 'C2JWGTestKeySomething')).toThrow(
      'The template ID is required',
    );
  });

  it('should call the sendForm with id selector', async () => {
    const form: HTMLFormElement = document.createElement('form');
    form.id = 'form-id';
    document.body.appendChild(form);

    try {
      const result = await sendForm(
        'default_service',
        'my_test_template',
        '#form-id',
        'C2JWGTestKeySomething',
      );
      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should call the sendForm with form element', async () => {
    const form: HTMLFormElement = document.createElement('form');

    try {
      const result = await sendForm(
        'default_service',
        'my_test_template',
        form,
        'C2JWGTestKeySomething',
      );
      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});

describe('sdk v4', () => {
  it('should call the sendForm method and fail on the public key', () => {
    expect(() => sendForm('default_service', 'my_test_template', '#form-id')).toThrow(
      'The public key is required',
    );
  });

  it('should call the sendForm method and fail on the service ID', () => {
    expect(() =>
      sendForm('', 'my_test_template', '#form-id', {
        publicKey: 'C2JWGTestKeySomething',
      }),
    ).toThrow('The service ID is required');
  });

  it('should call the sendForm method and fail on the template ID', () => {
    expect(() =>
      sendForm('default_service', '', '#form-id', {
        publicKey: 'C2JWGTestKeySomething',
      }),
    ).toThrow('The template ID is required');
  });

  it('should call the sendForm and fail on headless', async () => {
    const form: HTMLFormElement = document.createElement('form');

    try {
      const result = await sendForm('default_service', 'my_test_template', form, {
        publicKey: 'C2JWGTestKeySomething',
        blockHeadless: true,
      });
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toEqual({
        status: 451,
        text: 'Unavailable For Headless Browser',
      });
    }
  });

  it('should call the sendForm and fail on headless as promise', () => {
    const form: HTMLFormElement = document.createElement('form');

    return sendForm('default_service', 'my_test_template', form, {
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

  it('should call the sendForm and fail on blocklist', async () => {
    const form: HTMLFormElement = document.createElement('form');
    const input: HTMLInputElement = document.createElement('input');

    input.type = 'hidden';
    input.name = 'email';
    input.value = 'bar@emailjs.com';

    form.append(input);

    try {
      const result = await sendForm('default_service', 'my_test_template', form, {
        publicKey: 'C2JWGTestKeySomething',
        blockList: {
          list: ['foo@emailjs.com', 'bar@emailjs.com'],
          watchVariable: 'email',
        },
      });

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toEqual({
        status: 403,
        text: 'Forbidden',
      });
    }
  });

  it('should call the sendForm and fail on blocklist as promise', () => {
    const form: HTMLFormElement = document.createElement('form');
    const input: HTMLInputElement = document.createElement('input');

    input.type = 'hidden';
    input.name = 'email';
    input.value = 'bar@emailjs.com';

    form.append(input);

    return sendForm('default_service', 'my_test_template', form, {
      publicKey: 'C2JWGTestKeySomething',
      blockList: {
        list: ['foo@emailjs.com', 'bar@emailjs.com'],
        watchVariable: 'email',
      },
    }).then(
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

  it('should call the sendForm method and fail on limit rate', async () => {
    const form: HTMLFormElement = document.createElement('form');

    const sendEmail = () =>
      sendForm('default_service', 'my_test_template', form, {
        publicKey: 'C2JWGTestKeySomething',
        limitRate: {
          id: 'async-form',
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

  it('should call the sendForm method and fail on limit rate as promise', () => {
    const form: HTMLFormElement = document.createElement('form');

    const sendEmail = () =>
      sendForm('default_service', 'my_test_template', form, {
        publicKey: 'C2JWGTestKeySomething',
        limitRate: {
          id: 'promise-form',
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

  it('should call the sendForm with id selector', async () => {
    const form: HTMLFormElement = document.createElement('form');
    form.id = 'form-id';
    document.body.appendChild(form);

    try {
      const result = await sendForm('default_service', 'my_test_template', '#form-id', {
        publicKey: 'C2JWGTestKeySomething',
      });

      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should call the sendForm with form element', async () => {
    const form: HTMLFormElement = document.createElement('form');

    try {
      const result = await sendForm('default_service', 'my_test_template', form, {
        publicKey: 'C2JWGTestKeySomething',
      });

      expect(result).toEqual({ status: 200, text: 'OK' });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should call the sendForm with form element as promise', () => {
    const form: HTMLFormElement = document.createElement('form');

    return sendForm('default_service', 'my_test_template', form, {
      publicKey: 'C2JWGTestKeySomething',
    }).then(
      (result) => {
        expect(result).toEqual({ status: 200, text: 'OK' });
      },
      (error) => {
        expect(error).toBeUndefined();
      },
    );
  });
});
