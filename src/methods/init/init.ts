import { store } from '../../store/store';

/**
 * Initiation
 * @param {string} userID - set the EmailJS user ID
 * @param {string} origin - set the EmailJS origin
 */

export const init = (userID: string, origin = 'https://api.emailjs.com'): void => {
  store._userID = userID;
  store._origin = origin;
};
