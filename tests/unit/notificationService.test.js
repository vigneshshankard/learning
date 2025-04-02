// Mock nodemailer and constants
const mockSendMail = jest.fn(() => Promise.resolve());
const mockVerify = jest.fn((cb) => cb(null, true));
jest.mock('../../backend/config/constants', () => ({
  DMARC_POLICY: 'quarantine',
  SPF_POLICY: 'reject'
}));

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: mockSendMail,
    verify: mockVerify
  })
}));

// Mock twilio
const mockCreate = jest.fn(() => Promise.resolve());
jest.mock('twilio', () => () => ({
  messages: {
    create: mockCreate
  }
}));

const { sendEmail, sendSMS } = require('../../backend/services/notificationService');

describe('Notification Service', () => {
  it('should send email', async () => {
    await sendEmail('test@example.com', 'Test', 'Message');
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@example.com',
      subject: 'Test',
      text: 'Message',
      headers: expect.objectContaining({
        'X-DMARC-Policy': 'quarantine',
        'X-SPF-Policy': 'reject'
      })
    }));
  });

  it('should send SMS', async () => {
    await sendSMS('+1234567890', 'Test SMS');
    expect(mockCreate).toHaveBeenCalledWith({
      body: 'Test SMS',
      to: '+1234567890'
    });
  });
});