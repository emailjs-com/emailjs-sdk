"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const store_1 = require("../../store/store");
const validateParams_1 = require("../../utils/validateParams");
const sendPost_1 = require("../../api/sendPost");
/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templatePrams - the template params, what will be set to the EmailJS template
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
const send = (serviceID, templateID, templatePrams, userID) => {
    const uID = userID || store_1.store._userID;
    (0, validateParams_1.validateParams)(uID, serviceID, templateID);
    const params = {
        lib_version: '3.3.1',
        user_id: uID,
        service_id: serviceID,
        template_id: templateID,
        template_params: templatePrams,
    };
    return (0, sendPost_1.sendPost)('/api/v1.0/email/send', JSON.stringify(params), {
        'Content-type': 'application/json',
    });
};
exports.send = send;
