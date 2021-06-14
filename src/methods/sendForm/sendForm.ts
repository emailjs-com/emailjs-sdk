import { store } from '../../store/store';
import { validateParams } from '../../utils/validateParams';
import { sendPost } from '../../api/sendPost';

import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';

const findHTMLForm = (form: string | HTMLFormElement): HTMLFormElement => {
  let currentForm: HTMLFormElement | null;

  if (typeof form === 'string') {
    currentForm = document.querySelector<HTMLFormElement>(form);
  } else {
    currentForm = form;
  }

  if (!currentForm || currentForm.nodeName !== 'FORM') {
    throw 'The 3rd parameter is expected to be the HTML form element or the style selector of form';
  }

  return currentForm;
};

/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
export const sendForm = (
  serviceID: string,
  templateID: string,
  form: string | HTMLFormElement,
  userID?: string,
): Promise<EmailJSResponseStatus> => {
  const uID = userID || store._userID;
  const currentForm = findHTMLForm(form);

  validateParams(uID, serviceID, templateID);

  const formData: FormData = new FormData(currentForm);
  formData.append('lib_version', process.env.npm_package_version!);
  formData.append('service_id', serviceID);
  formData.append('template_id', templateID);
  formData.append('user_id', uID!);

  return sendPost('/api/v1.0/email/send-form', formData);
};
