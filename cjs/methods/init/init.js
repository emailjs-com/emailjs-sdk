"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const store_1 = require("../../store/store");
/**
 * Initiation
 * @param {string} userID - set the EmailJS user ID
 * @param {string} origin - set the EmailJS origin
 */
const init = (userID, origin = 'https://api.emailjs.com') => {
    store_1.store._userID = userID;
    store_1.store._origin = origin;
};
exports.init = init;
