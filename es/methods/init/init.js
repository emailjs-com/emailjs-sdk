import { store } from '../../store/store';
/**
 * Initiation
 * @param {string} publicKey - set the EmailJS public key
 * @param {string} origin - set the EmailJS origin
 */
export const init = (publicKey, origin = 'https://api.emailjs.com') => {
    store._userID = publicKey;
    store._origin = origin;
};
