import { EmailJSResponseStatus } from '../models/EmailJSResponseStatus';
import { store } from '../store/store';

export const sendPost = async (
  url: string,
  data: string | FormData,
  headers: Record<string, string> = {},
): Promise<EmailJSResponseStatus> => {
  const response = await fetch(store.origin + url, {
    method: 'POST',
    headers,
    body: data,
  });

  const message = await response.text();
  const responseStatus = new EmailJSResponseStatus(response.status, message);

  if (response.ok) {
    return responseStatus;
  }

  throw responseStatus;
};
