import { MailGun } from '../../../src/classes/MailGun';
import { IEmailTransportRequest } from '../../../src/interfaces';
let mailgun: MailGun;

describe('SendGrid', () => {
  beforeEach(() => {
    mailgun = new MailGun('api-key', 'domain');
  });

  test('should set config values correctly', () => {
    expect(mailgun.apiKey).toBe('api-key');
    expect(mailgun.domain).toBe('domain');
    expect(mailgun.baseUrl).toBe('https://api:api-key@api.mailgun.net/v3');
  });

  test('should create request body correctly', () => {
    const payload: IEmailTransportRequest = {
      from: 'f@yopmail.com',
      to: ['a@yopmail.com'],
      cc: ['a1@yopmail.com'],
      bcc: ['a3@yopmail.com'],
      subject: 'my subject',
      body: 'test body',
    };
    const result = {
      from: 'f@yopmail.com',
      to: 'a@yopmail.com',
      cc: 'a1@yopmail.com',
      bcc: 'a3@yopmail.com',
      subject: 'my subject',
      text: 'test body',
    };
    expect(mailgun.createRequestBody(payload)).toEqual(result);
  });
});
