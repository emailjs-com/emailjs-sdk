import { EmailJSResponseStatus } from '../models/EmailJSResponseStatus';
export declare const sendPost: (url: string, data: string | FormData, headers?: Record<string, string>) => Promise<EmailJSResponseStatus>;
