export const validateParams = (publicKey?: string, serviceID?: string, templateID?: string) => {
  if (!publicKey) {
    throw 'The public key is required. Visit https://dashboard.emailjs.com/admin/account';
  }

  if (!serviceID) {
    throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
  }

  if (!templateID) {
    throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
  }

  return true;
};
