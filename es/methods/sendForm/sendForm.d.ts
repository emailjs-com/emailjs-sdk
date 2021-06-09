import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
export declare const sendForm: (serviceID: string, templateID: string, form: string | HTMLFormElement, userID?: string | undefined) => Promise<EmailJSResponseStatus>;
