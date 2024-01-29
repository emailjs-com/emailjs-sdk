export const isHeadless = (navigator: Navigator) => {
  return navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
};
