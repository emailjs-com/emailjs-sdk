import { EmailJSResponseStatus } from '../models/EmailJSResponseStatus';
import { store } from '../store/store';

export const sendPost = (
  url: string,
  data: string | FormData,
  headers: Record<string, string> = {},
): Promise<EmailJSResponseStatus> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', ({ target }) => {
      const responseStatus = new EmailJSResponseStatus(target as XMLHttpRequest);

      if (responseStatus.status === 200 || responseStatus.text === 'OK') {
        resolve(responseStatus);
      } else {
        reject(responseStatus);
      }
    });

    xhr.addEventListener('error', ({ target }) => {
      reject(new EmailJSResponseStatus(target as XMLHttpRequest));
    });

    xhr.open('POST', store._origin + url, true);

    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });

    xhr.send(data);
  });
};
