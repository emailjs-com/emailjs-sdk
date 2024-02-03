export class EmailJSResponseStatus {
  public status: number;
  public text: string;

  constructor(_status = 0, _text = 'Network Error') {
    this.status = _status;
    this.text = _text;
  }
}
