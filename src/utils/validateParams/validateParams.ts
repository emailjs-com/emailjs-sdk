export const validateParams = (publicKey?: unknown, serviceID?: unknown, templateID?: unknown) => {
  if (!publicKey || typeof publicKey !== 'string') {
    throw 'The public key is required. Visit https://dashboard.emailjs.com/admin/account';
  }

  if (!serviceID || typeof serviceID !== 'string') {
    throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
  }

  if (!templateID || typeof templateID !== 'string') {
    throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
  }
};
