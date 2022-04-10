import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templatePrams - the template params, what will be set to the EmailJS template
 * @param {string} publicKey - the EmailJS public key
 * @returns {Promise<EmailJSResponseStatus>}
 */
export declare const send: (serviceID: string, templateID: string, templatePrams?: Record<string, unknown> | undefined, publicKey?: string | undefined) => Promise<EmailJSResponseStatus>;
