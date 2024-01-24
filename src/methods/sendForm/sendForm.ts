import { store } from '../../store/store';
import { sendPost } from '../../api/sendPost';
import { buildOptions } from '../../utils/buildOptions';
import { validateForm } from '../../utils/validateForm';
import { validateParams } from '../../utils/validateParams';

import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
import type { Options } from '../../types/Options';

const findHTMLForm = (form: string | HTMLFormElement): HTMLFormElement | null => {
  return typeof form === 'string' ? document.querySelector<HTMLFormElement>(form) : form;
};

/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {object} options - the EmailJS SDK config options
 * @returns {Promise<EmailJSResponseStatus>}
 */
export const sendForm = (
  serviceID: string,
  templateID: string,
  form: string | HTMLFormElement,
  options?: Options | string,
): Promise<EmailJSResponseStatus> => {
  const opts = buildOptions(options);
  const publicKey = opts.publicKey || store.publicKey;
  const currentForm = findHTMLForm(form);

  validateParams(publicKey, serviceID, templateID);
  validateForm(currentForm);

  const formData: FormData = new FormData(currentForm!);
  formData.append('lib_version', process.env.npm_package_version!);
  formData.append('service_id', serviceID);
  formData.append('template_id', templateID);
  formData.append('user_id', publicKey!);

  return sendPost('/api/v1.0/email/send-form', formData);
};
