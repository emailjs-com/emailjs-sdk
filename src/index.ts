import 'promise-polyfill';
import {EmailJSResponseStatus} from './models/EmailJSResponseStatus';
import {UI} from './services/ui/UI';

export class EmailJS {

  private _userID: string = null;

  private sendPost(url: string, data: string | FormData, headers: Object = {}): Promise<EmailJSResponseStatus> {
    return new Promise((resolve, reject) => {
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.addEventListener('load', (event) => {
        let responseStatus: EmailJSResponseStatus = new EmailJSResponseStatus(<XMLHttpRequest>event.target);
        if (responseStatus.status === 200 || responseStatus.text === 'OK') {
          resolve(responseStatus);
        } else {
          reject(responseStatus);
        }
      });

      xhr.addEventListener('error', (event) => {
        reject(new EmailJSResponseStatus(<XMLHttpRequest>event.target));
      });

      xhr.open('POST', url, true);

      for (let key in headers) {
          xhr.setRequestHeader(key, headers[key]);
      }

      xhr.send(data);
    });
  }

  private appendGoogleCaptcha(templatePrams?: Object): Object {
    let element: HTMLInputElement = <HTMLInputElement>document.getElementById('g-recaptcha-response');

    if (element && element.value) {
      templatePrams['g-recaptcha-response'] = element.value;
    }

    element = null;
    return templatePrams;
  }

  /**
   * Initiation
   * @param {string} userID - set the emailJS user ID
   */
  public init(userID: string): void {
    this._userID = userID;
  }

  /**
   * Send a template to the specific EmailJS service
   * @param {string} serviceID - the EmailJS service ID
   * @param {string} templateID - the EmailJS template ID
   * @param {Object} templatePrams - the template params, what will be set to the EmailJS template
   * @param {string} userID - the EmailJS user ID
   * @returns {Promise<EmailJSResponseStatus>}
   */
  public send(serviceID: string, templateID: string, templatePrams?: Object, userID?: string): Promise<EmailJSResponseStatus> {
    let params: Object = {
      lib_version: '<<VERSION>>',
      user_id: userID || this._userID,
      service_id: serviceID,
      template_id: templateID,
      template_params: this.appendGoogleCaptcha(templatePrams)
    };

    return this.sendPost('https://api.emailjs.com/api/v1.0/email/send', JSON.stringify(params), {
      'Content-type': 'application/json'
    });
  }

  /**
   * Send a form the specific EmailJS service
   * @param {string} serviceID - the emailJS service ID
   * @param {string} templateID - the emailJS template ID
   * @param {string | HTMLFormElement} form - the form element or selector
   * @param {string} userID - the emailJS user ID
   * @returns {Promise<EmailJSResponseStatus>}
   */
  public sendForm(serviceID: string, templateID: string, form: string | HTMLFormElement, userID?: string): Promise<EmailJSResponseStatus> {
    if (typeof form === 'string') {
      form = <HTMLFormElement>document.querySelector(form);
    }

    if (!form || form.nodeName !== 'FORM') {
      throw 'Expected the HTML form element or the style selector of form';
    }

    UI.progressState(form);
    let formData: FormData = new FormData(form);
    formData.append('lib_version', '<<VERSION>>');
    formData.append('service_id', serviceID);
    formData.append('template_id', templateID);
    formData.append('user_id', userID || this._userID);

    return this.sendPost('https://api.emailjs.com/api/v1.0/email/send-form', formData)
      .then((response) => {
        UI.successState(<HTMLFormElement>form);
        return response;
      }, (error) => {
        UI.errorState(<HTMLFormElement>form);
        return Promise.reject(error);
      });
  }
}

export const emailjs: EmailJS = new EmailJS();
(<any>window).emailjs = emailjs;
