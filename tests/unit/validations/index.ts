import { validateEmailShouldBeUnique } from '../../../src/validations/index';
import { badRequest } from 'boom';

describe('Validations', () => {
  describe('validateEmailShouldBeUnique method', () => {
    test('Should throw error if there are duplicate emails in to and cc', () => {
      const to = ['a@yopmail.com'];
      const cc = ['a@yopmail.com'];
      return expect(() => {
        validateEmailShouldBeUnique(to, cc);
      }).toThrowError(badRequest('Emails should be unique between to,cc and bcc'));
    });

    test('Should throw error if there are duplicate emails in to and bcc', () => {
      const to = ['a@yopmail.com'];
      const cc = ['a1@yopmail.com'];
      const bcc = ['a@yopmail.com'];
      return expect(() => {
        validateEmailShouldBeUnique(to, cc, bcc);
      }).toThrowError(badRequest('Emails should be unique between to,cc and bcc'));
    });

    test('Should throw error if there are duplicate emails in to ,cc and bcc', () => {
      const to = ['a@yopmail.com'];
      const cc = ['a@yopmail.com'];
      const bcc = ['a@yopmail.com'];
      return expect(() => {
        validateEmailShouldBeUnique(to, cc, bcc);
      }).toThrowError(badRequest('Emails should be unique between to,cc and bcc'));
    });
  });
});
