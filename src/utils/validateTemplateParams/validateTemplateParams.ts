export const validateTemplateParams = (templateParams?: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  if (templateParams && templateParams.toString() !== '[object Object]') {
    throw 'The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/';
  }
};
