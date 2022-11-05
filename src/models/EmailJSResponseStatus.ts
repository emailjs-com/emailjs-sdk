export class EmailJSResponseStatus {
  public status: number;
  public text: string;

  constructor(httpResponse: XMLHttpRequest | null) {
    this.status = httpResponse ? httpResponse.status : 0;
    this.text = httpResponse ? httpResponse.responseText : 'Network Error';
  }
}
