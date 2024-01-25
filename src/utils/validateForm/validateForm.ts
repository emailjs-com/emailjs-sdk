export const validateForm = (form: HTMLFormElement | null) => {
  if (!form || form.nodeName !== 'FORM') {
    throw 'The 3rd parameter is expected to be the HTML form element or the style selector of the form';
  }
};
