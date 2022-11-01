export class EmailJSResponseStatus {
  public status: number;
  public text: string;

  constructor(httpResponse: XMLHttpRequest | null) {
    this.status = httpResponse?.status || 0;
    this.text = httpResponse?.responseText || 'Network Error';
  }
}
