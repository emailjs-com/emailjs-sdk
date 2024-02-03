export const isHeadless = (navigator: Navigator): boolean => {
  return navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
};
