import type { EmailJSResponseStatus } from './models/EmailJSResponseStatus';
import type { StorageProvider } from './types/StorageProvider';
import { init } from './methods/init/init';
import { send } from './methods/send/send';
import { sendForm } from './methods/sendForm/sendForm';

export type { EmailJSResponseStatus, StorageProvider };

export { init, send, sendForm };

export default {
  init,
  send,
  sendForm,
};
