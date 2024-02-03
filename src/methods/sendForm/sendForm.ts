import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
import type { Options } from '../../types/Options';

import { store } from '../../store/store';
import { sendPost } from '../../api/sendPost';
import { buildOptions } from '../../utils/buildOptions/buildOptions';
import { validateForm } from '../../utils/validateForm/validateForm';
import { validateParams } from '../../utils/validateParams/validateParams';
import { isHeadless } from '../../utils/isHeadless/isHeadless';
import { headlessError } from '../../errors/headlessError/headlessError';
import { isBlockedValueInParams } from '../../utils/isBlockedValueInParams/isBlockedValueInParams';
import { blockedEmailError } from '../../errors/blockedEmailError/blockedEmailError';
import { isLimitRateHit } from '../../utils/isLimitRateHit/isLimitRateHit';
import { limitRateError } from '../../errors/limitRateError/limitRateError';

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
  const blockHeadless = opts.blockHeadless || store.blockHeadless;
  const blockList = { ...store.blockList, ...opts.blockList };
  const limitRate = { ...store.limitRate, ...opts.limitRate };

  if (blockHeadless && isHeadless(navigator)) {
    return Promise.reject(headlessError());
  }

  const currentForm = findHTMLForm(form);

  validateParams(publicKey, serviceID, templateID);
  validateForm(currentForm);

  const formData: FormData = new FormData(currentForm!);

  if (isBlockedValueInParams(blockList, formData)) {
    return Promise.reject(blockedEmailError());
  }

  if (isLimitRateHit(localStorage, location.pathname, limitRate)) {
    return Promise.reject(limitRateError());
  }

  formData.append('lib_version', process.env.npm_package_version!);
  formData.append('service_id', serviceID);
  formData.append('template_id', templateID);
  formData.append('user_id', publicKey!);

  return sendPost('/api/v1.0/email/send-form', formData);
};
