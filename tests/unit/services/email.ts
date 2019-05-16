import { sendEmail } from '../../../src/services/email';
import * as emailServerManager from '../../../src/services/email-server-manager';
import { badRequest } from 'boom';

describe('Email Service', () => {
  describe('sendEmail method', () => {
    test('should throw joi validation error if to email is not provided', async () => {
      const error = new Error('child "to email" fails because [to email is required]');
      error.name = 'ValidationError';
      return expect(sendEmail({} as any)).rejects.toEqual(error);
    });

    test('should throw joi validation error if to email is not an array', async () => {
      const payload: any = {
        to: 'asjadsaboor@yopmail.com',
      };
      const error = new Error('child "to email" fails because [to email must be an array]');
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if to email is  invalid', async () => {
      const payload: any = {
        to: ['abc123'],
      };
      const error = new Error(
        'child "to email" fails because [to email at position 0 fails because [to must be a valid email]]',
      );
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if cc email is not an array', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: 'abc@yopmail.com',
      };
      const error = new Error('child "cc email" fails because [cc email must be an array]');
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if cc email is  invalid', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['abc'],
      };
      const error = new Error(
        'child "cc email" fails because [cc email at position 0 fails because [cc must be a valid email]]',
      );
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if bcc email is not an array', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: 'abc@yopmail.com',
      };
      const error = new Error('child "bcc email" fails because [bcc email must be an array]');
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if bcc email is  invalid', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: ['abc'],
      };
      const error = new Error(
        'child "bcc email" fails because [bcc email at position 0 fails because [bcc must be a valid email]]',
      );
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if subject is not provided', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: ['a3@yopmail.com'],
      };
      const error = new Error('child "subject" fails because [subject is required]');
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if body is not provided', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: ['a3@yopmail.com'],
        subject: 'test subject',
      };
      const error = new Error('child "body" fails because [body is required]');
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw joi validation error if subject is greater than  250 char', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: ['a3@yopmail.com'],
        subject: `test subject test subject test subject test subject test subject test subject test subject
        test subject test subject test subject test subject test subject test subject test subject
        test subject test subject test subject test subject test subject test subject test subject
        test subject test subject test subject test subject test subject test subject test subject
        test subject test subject test subject test subject test subject test subject test subject `,
      };
      const error = new Error(
        'child "subject" fails because [subject length must be less than or equal to 250 characters long]',
      );
      error.name = 'ValidationError';
      return expect(sendEmail(payload)).rejects.toEqual(error);
    });

    test('should throw error if there are duplicate email in to and  cc', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a1@yopmail.com'],
        bcc: ['a2@yopmail.com'],
        subject: 'test subject',
        body: 'asda',
      };
      return expect(sendEmail(payload)).rejects.toEqual(
        badRequest('Emails should be unique between to,cc and bcc'),
      );
    });

    test('should throw error if there are duplicate email in to and  bcc', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: ['a1@yopmail.com'],
        subject: 'test subject',
        body: 'asda',
      };
      return expect(sendEmail(payload)).rejects.toEqual(
        badRequest('Emails should be unique between to,cc and bcc'),
      );
    });

    test('should throw error if there are duplicate email in to ,cc and  bcc', async () => {
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a1@yopmail.com'],
        bcc: ['a1@yopmail.com'],
        subject: 'test subject',
        body: 'asda',
      };
      return expect(sendEmail(payload)).rejects.toEqual(
        badRequest('Emails should be unique between to,cc and bcc'),
      );
    });

    test('should invoke sendEmail method of email server manager if payload is okay', async () => {
      Object.defineProperty(emailServerManager, 'sendEmail', {
        value: jest.fn().mockImplementation(() => Promise.resolve({ success: true })),
      });
      const payload: any = {
        to: ['a1@yopmail.com'],
        cc: ['a2@yopmail.com'],
        bcc: ['a3@yopmail.com'],
        subject: 'test subject',
        body: 'asda',
      };
      const spy = jest.spyOn(emailServerManager, 'sendEmail');
      const sendingEmail = await sendEmail(payload);
      expect(sendingEmail).toBe(undefined);
      return expect(spy).toHaveBeenCalled;
    });
  });
});
