import type { EmailJSResponseStatus } from './models/EmailJSResponseStatus';
import { init } from './methods/init/init';
import { send } from './methods/send/send';
import { sendForm } from './methods/sendForm/sendForm';
export type { EmailJSResponseStatus };
export { init, send, sendForm };
declare const _default: {
    init: (publicKey: string, origin?: string) => void;
    send: (serviceID: string, templateID: string, templatePrams?: Record<string, unknown> | undefined, publicKey?: string | undefined) => Promise<EmailJSResponseStatus>;
    sendForm: (serviceID: string, templateID: string, form: string | HTMLFormElement, publicKey?: string | undefined) => Promise<EmailJSResponseStatus>;
};
export default _default;
