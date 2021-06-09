import { store } from '../../store/store';
/**
 * Initiation
 * @param {string} userID - set the EmailJS user ID
 * @param {string} origin - set the EmailJS origin
 */
export const init = (userID, origin = 'https://api.emailjs.com') => {
    store._userID = userID;
    store._origin = origin;
};
