import { store } from '../../store/store';
import { sendPost } from '../../api/sendPost';
import { buildOptions } from '../../utils/buildOptions/buildOptions';
import { validateParams } from '../../utils/validateParams/validateParams';
import { validateTemplateParams } from '../../utils/validateTemplateParams/validateTemplateParams';

import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
import type { Options } from '../../types/Options';

/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templateParams - the template params, what will be set to the EmailJS template
 * @param {object} options - the EmailJS SDK config options
 * @returns {Promise<EmailJSResponseStatus>}
 */
export const send = (
  serviceID: string,
  templateID: string,
  templateParams?: Record<string, unknown>,
  options?: Options | string,
): Promise<EmailJSResponseStatus> => {
  const opts = buildOptions(options);
  const publicKey = opts.publicKey || store.publicKey;

  validateParams(publicKey, serviceID, templateID);
  validateTemplateParams(templateParams);

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
