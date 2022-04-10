"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const store_1 = require("../../store/store");
/**
 * Initiation
 * @param {string} publicKey - set the EmailJS public key
 * @param {string} origin - set the EmailJS origin
 */
const init = (publicKey, origin = 'https://api.emailjs.com') => {
    store_1.store._userID = publicKey;
    store_1.store._origin = origin;
};
exports.init = init;
