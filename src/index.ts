import 'whatwg-fetch';
import 'promise-polyfill';

export class EmailJS {

  private _URL: string = 'https://api.emailjs.com/api/v1.0/email/send';
  private _userID: string = null;

  /**
   * Initiation
   * @param {string} userID - set the emailJS user ID
   */
  public init(userID: string): void {
    this._userID = userID;
  }

  /**
   * Send a template to specific server ID
   * @param {string} serverID - the emailJS server ID
   * @param {string} templateID - the emailJS template ID
   * @param {Object} templatePrams - the template params, what will be set to the emailJS template
   * @param {string} userID - the emailJS user ID
   * @returns {<Response>}
   */
  public send(serverID: string, templateID: string, templatePrams?: Object, userID?: string): Promise<Response> {
    let params: Object = {
      lib_version: '<<VERSION>>',
      user_id: userID || this._userID,
      service_id: serverID,
      template_id: templateID,
      template_params: templatePrams
    };

    return fetch(this._URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(params)
    });
  }
}

export const emailjs: EmailJS = new EmailJS();
(<any>window).emailjs = emailjs;
