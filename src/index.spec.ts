import * as emailjs from './index';

test ('send method should call error', () => {
  expect.assertions(1);

  return emailjs.send('test', 'test')
    .then((resolve) => {
      expect(resolve).toBeUndefined();
    }, (error) => {
      expect(error).toBeDefined();
    });
});

test ('init and send method should be success', () => {
  expect.assertions(1);

  emailjs.init('user_LC2JWGNosRSeMY6HmQFUn');

  return emailjs.send('default_service', 'my_test_template', {
    reply_to: 'support@emailjs.com',
    to_name: 'Tester',
    from_name: 'JEST',
    message_html: '<span style="color:#ff5500">Looks like this test is passed</span>'
  }).then((resolve) => {
      expect(resolve).toEqual({'status': 200, 'text': 'OK'});
    }, (error) => {
      expect(error).toBeUndefined();
    });
});

test ('send method should be success', () => {
  expect.assertions(1);

  return emailjs.send('default_service', 'my_test_template', {
    reply_to: 'support@emailjs.com',
    to_name: 'Tester',
    from_name: 'JEST',
    message_html: '<span style="color:#ff5500">Looks like this test is passed</span>'
  } , 'user_LC2JWGNosRSeMY6HmQFUn')
    .then((resolve) => {
      expect(resolve).toEqual({'status': 200, 'text': 'OK'});
    }, (error) => {
      expect(error).toBeUndefined();
    });
});

test ('sendForm method form element validation', () => {
  expect(() => emailjs.sendForm('test', 'test', '.form-not-exist'))
    .toThrow('Expected the HTML form element or the style selector of form');
});

test ('sendForm method should call error', () => {
  let form: HTMLFormElement = <HTMLFormElement>document.createElement('FORM');
  expect.assertions(1);

  return emailjs.sendForm('test', 'test', form)
    .then((resolve) => {
      expect(resolve).toBeUndefined();
    }, (error) => {
      expect(error).toBeDefined();
    });
});

test ('sendForm method should be success', () => {
  let form: HTMLFormElement = <HTMLFormElement>document.createElement('FORM');
  let username: HTMLInputElement = <HTMLInputElement>document.createElement('INPUT');
  username.name = 'username';
  username.value = 'JEST';
  form.appendChild(username);

  expect.assertions(1);

  return emailjs.sendForm('default_service', 'my_test_template', form, 'user_LC2JWGNosRSeMY6HmQFUn')
    .then((resolve) => {
      expect(resolve).toEqual({'status': 200, 'text': 'OK'});
    }, (error) => {
      expect(error).toBeUndefined();
    });
});
