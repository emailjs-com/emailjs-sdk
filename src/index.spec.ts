import {emailjs} from './index';

test ('should set userID', () => {
  let userID: string = 'emailJS-testID';
  emailjs.init(userID);
  expect((<any>emailjs)._userID).toBe(userID);
});

test ('send method should call error', () => {
  expect.assertions(1);

  return emailjs.send('test', 'test')
    .then((resolve) => {
      expect(resolve).toBeUndefined();
    }, (error) => {
      expect(error).toBeDefined();
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

test ('should be same object', () => {
  expect(emailjs).toBe((<any>window).emailjs);
});
