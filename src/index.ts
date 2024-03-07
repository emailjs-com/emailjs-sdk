import type { StorageProvider } from './types/StorageProvider';
import { EmailJSResponseStatus } from './models/EmailJSResponseStatus';
import { init } from './methods/init/init';
import { send } from './methods/send/send';
import { sendForm } from './methods/sendForm/sendForm';

export type { StorageProvider };

export { init, send, sendForm };

export default {
  init,
  send,
  sendForm,
  EmailJSResponseStatus,
};
