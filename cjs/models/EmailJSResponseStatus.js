"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailJSResponseStatus = void 0;
class EmailJSResponseStatus {
    constructor(httpResponse) {
        this.status = httpResponse?.status || 0;
        this.text = httpResponse?.responseText || 'Network Error';
    }
}
exports.EmailJSResponseStatus = EmailJSResponseStatus;
