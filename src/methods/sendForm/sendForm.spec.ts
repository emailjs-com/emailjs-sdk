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
});
