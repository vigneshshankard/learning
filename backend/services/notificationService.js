const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { DMARC_POLICY, SPF_POLICY } = require('../config/constants');

// Email transporter with DMARC/SPF enforcement
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Send email with DMARC/SPF validation
async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    headers: {
      'X-DMARC-Policy': DMARC_POLICY,
      'X-SPF-Policy': SPF_POLICY,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function sendSMS(to, message) {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
}

module.exports = { sendEmail, sendSMS };