import { EmailJSResponseStatus } from './EmailJSResponseStatus';

it('should handle the success response', () => {
  const error = new EmailJSResponseStatus({
    status: 200,
    responseText: 'OK',
  } as XMLHttpRequest);

  expect(error).toEqual({
    status: 200,
    text: 'OK',
  });
});

it('should handle the fail response', () => {
  const error = new EmailJSResponseStatus({
    status: 404,
    responseText: 'No Found',
  } as XMLHttpRequest);

  expect(error).toEqual({
    status: 404,
    text: 'No Found',
  });
});

it('should handle the null response', () => {
  const error = new EmailJSResponseStatus(null);

  expect(error).toEqual({
    status: 0,
    text: 'Network Error',
  });
});
