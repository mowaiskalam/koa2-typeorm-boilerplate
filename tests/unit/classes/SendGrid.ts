import { SendGrid } from '../../../src/classes/SendGrid';
import { IEmailTransportRequest } from '../../../src/interfaces';
let sendgrid: SendGrid;

describe('SendGrid', () => {
  beforeEach(() => {
    sendgrid = new SendGrid('api-key');
  });

  test('should set config values correctly', () => {
    expect(sendgrid.apiKey).toBe('api-key');
    expect(sendgrid.baseUrl).toBe('https://api.sendgrid.com');
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
      personalizations: [
        {
          to: [
            {
              email: 'a@yopmail.com',
            },
          ],
          cc: [
            {
              email: 'a1@yopmail.com',
            },
          ],
          bcc: [
            {
              email: 'a3@yopmail.com',
            },
          ],
          subject: 'my subject',
        },
      ],
      from: {
        email: 'f@yopmail.com',
      },
      content: [
        {
          type: 'text/plain',
          value: 'test body',
        },
      ],
    };
    expect(sendgrid.createRequestBody(payload)).toEqual(result);
  });
});
