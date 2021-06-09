export class EmailJSResponseStatus {
    status;
    text;
    constructor(httpResponse) {
        this.status = httpResponse.status;
        this.text = httpResponse.responseText;
    }
}
