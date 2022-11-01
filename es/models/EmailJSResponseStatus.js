export class EmailJSResponseStatus {
    constructor(httpResponse) {
        this.status = httpResponse?.status || 0;
        this.text = httpResponse?.responseText || 'Network Error';
    }
}
