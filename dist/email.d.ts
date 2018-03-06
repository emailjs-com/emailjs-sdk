export declare class EmailJS {
    private _userID;
    private sendPost(url, data, headers?);
    private appendGoogleCaptcha(templatePrams?);
    /**
     * Initiation
     * @param {string} userID - set the EmailJS user ID
     */
    init(userID: string): void;
    /**
     * Send a template to the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {Object} templatePrams - the template params, what will be set to the EmailJS template
     * @param {string} userID - the EmailJS user ID
     * @returns {Promise<EmailJSResponseStatus>}
     */
    send(serviceID: string, templateID: string, templatePrams?: Object, userID?: string): Promise<EmailJSResponseStatus>;
    /**
     * Send a form the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {string | HTMLFormElement} form - the form element or selector
     * @param {string} userID - the EmailJS user ID
     * @returns {Promise<EmailJSResponseStatus>}
     */
    sendForm(serviceID: string, templateID: string, form: string | HTMLFormElement, userID?: string): Promise<EmailJSResponseStatus>;
}
export declare const emailjs: EmailJS;

export declare class EmailJSResponseStatus {
    status: number;
    text: string;
    constructor(httpResponse: XMLHttpRequest);
}

export declare class UI {
    private static readonly PROGRESS;
    private static readonly DONE;
    private static readonly ERROR;
    static clearAll(form: HTMLFormElement): void;
    static progressState(form: HTMLFormElement): void;
    static successState(form: HTMLFormElement): void;
    static errorState(form: HTMLFormElement): void;
}
