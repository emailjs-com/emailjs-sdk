export const validateTemplateParams = (templateParams?: Record<string, unknown>) => {
  if (templateParams && typeof templateParams !== 'object') {
    throw 'The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/';
  }
};
