import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus.js';
import type { Options } from '../../types/Options.js';

import { store } from '../../store/store.js';
import { sendPost } from '../../api/sendPost.js';
import { buildOptions } from '../../utils/buildOptions/buildOptions.js';
import { validateParams } from '../../utils/validateParams/validateParams.js';
import { validateTemplateParams } from '../../utils/validateTemplateParams/validateTemplateParams.js';
import { isHeadless } from '../../utils/isHeadless/isHeadless.js';
import { headlessError } from '../../errors/headlessError/headlessError.js';
import { isBlockedValueInParams } from '../../utils/isBlockedValueInParams/isBlockedValueInParams.js';
import { blockedEmailError } from '../../errors/blockedEmailError/blockedEmailError.js';
import { isLimitRateHit } from '../../utils/isLimitRateHit/isLimitRateHit.js';
import { limitRateError } from '../../errors/limitRateError/limitRateError.js';

/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templateParams - the template params, what will be set to the EmailJS template
 * @param {object} options - the EmailJS SDK config options
 * @returns {Promise<EmailJSResponseStatus>}
 */
export const send = async (
  serviceID: string,
  templateID: string,
  templateParams?: Record<string, unknown>,
  options?: Options | string,
): Promise<EmailJSResponseStatus> => {
  const opts = buildOptions(options);
  const publicKey = opts.publicKey || store.publicKey;
  const blockHeadless = opts.blockHeadless || store.blockHeadless;
  const storageProvider = opts.storageProvider || store.storageProvider;
  const blockList = { ...store.blockList, ...opts.blockList };
  const limitRate = { ...store.limitRate, ...opts.limitRate };

  if (blockHeadless && isHeadless(navigator)) {
    return Promise.reject(headlessError());
  }

  validateParams(publicKey, serviceID, templateID);
  validateTemplateParams(templateParams);

  if (templateParams && isBlockedValueInParams(blockList, templateParams)) {
    return Promise.reject(blockedEmailError());
  }

  if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
    return Promise.reject(limitRateError());
  }

  const params = {
    lib_version: process.env.npm_package_version,
    user_id: publicKey,
    service_id: serviceID,
    template_id: templateID,
    template_params: templateParams,
  };

  return sendPost('/api/v1.0/email/send', JSON.stringify(params), {
    'Content-type': 'application/json',
  });
};
