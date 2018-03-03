import {expect} from 'chai';
import {emailjs} from './index';

describe('emailJS', () => {
  it ('should set userID', () => {
    let userID: string = 'emailJS-testID';
    emailjs.init(userID);
    expect((<any>emailjs)._userID).to.equal(userID);
  });

  it ('should fail', () => {
    emailjs.send('test', 'test')
      .then((resolve) => {
        return expect(resolve).to.be.undefined;
      }, (error) => {
        return expect(error).to.be.not.undefined;
      });
  });
});
