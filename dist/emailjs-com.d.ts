import 'whatwg-fetch';
import 'promise-polyfill';
export declare class EmailJS {
    private _URL;
    private _userID;
    /**
     * Initiation
     * @param {string} userID - set the emailJS user ID
     */
    init(userID: string): void;
    /**
     * Send a template to specific server ID
     * @param {string} serverID - the emailJS server ID
     * @param {string} templateID - the emailJS template ID
     * @param {Object} templatePrams - the template params, what will be set to the emailJS template
     * @param {string} userID - the emailJS user ID
     * @returns {<Response>}
     */
    send(serverID: string, templateID: string, templatePrams?: Object, userID?: string): Promise<Response>;
}
export declare const emailjs: EmailJS;
