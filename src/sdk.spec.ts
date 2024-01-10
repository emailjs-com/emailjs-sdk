import { it, expect, jest } from '@jest/globals';

import emailjs from './index';
import { EmailJSResponseStatus } from './models/EmailJSResponseStatus';

const responseWrapper = () => {
  return Promise.resolve(
    new EmailJSResponseStatus({
      status: 200,
      responseText: 'OK',
    } as XMLHttpRequest),
  );
};

jest.mock('./api/sendPost', () => ({
  sendPost: jest.fn(() => {
    return responseWrapper();
  }),
}));

it('should send method and fail on the public key', () => {
  expect(() => emailjs.send('default_service', 'my_test_template')).toThrow(
    'The public key is required',
  );
});

it('should send method and fail on the service ID', () => {
  emailjs.init('user_LC2JWGTestKeySomething');

  expect(() => emailjs.send('', 'my_test_template')).toThrow('The service ID is required');
});

it('should send method and fail on the template ID', () => {
  emailjs.init('user_LC2JWGTestKeySomething');

  expect(() => emailjs.send('default_service', '')).toThrow('The template ID is required');
});

it('should init and send method successfully', async () => {
  emailjs.init('user_LC2JWGTestKeySomething');

  try {
    const result = await emailjs.send('default_service', 'my_test_template');
    expect(result).toEqual({ status: 200, text: 'OK' });
  } catch (error) {
    expect(error).toBeUndefined();
  }
});

it('should send method successfully with 4 params', async () => {
  try {
    const result = await emailjs.send(
      'default_service',
      'my_test_template',
      {},
      'user_LC2JWGTestKeySomething',
    );
    expect(result).toEqual({ status: 200, text: 'OK' });
  } catch (error) {
    expect(error).toBeUndefined();
  }
});

it('should call sendForm and throw non-form element error', () => {
  expect(() => emailjs.sendForm('default_service', 'my_test_template', 'form-not-exist')).toThrow(
    'The 3rd parameter is expected to be the HTML form element or the style selector of form',
  );
});

it('should call sendForm with id selector', async () => {
  const form: HTMLFormElement = document.createElement('form');
  form.id = 'form-id';
  document.body.appendChild(form);

  try {
    const result = await emailjs.sendForm(
      'default_service',
      'my_test_template',
      '#form-id',
      'user_LC2JWGTestKeySomething',
    );
    expect(result).toEqual({ status: 200, text: 'OK' });
  } catch (error) {
    expect(error).toBeUndefined();
  }
});

it('should call sendForm with form element', async () => {
  const form: HTMLFormElement = document.createElement('form');

  try {
    const result = await emailjs.sendForm(
      'default_service',
      'my_test_template',
      form,
      'user_LC2JWGTestKeySomething',
    );
    expect(result).toEqual({ status: 200, text: 'OK' });
  } catch (error) {
    expect(error).toBeUndefined();
  }
});
