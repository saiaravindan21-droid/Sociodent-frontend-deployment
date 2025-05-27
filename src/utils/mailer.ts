import nodemailer from 'nodemailer';
import { EmailTemplates } from './emailTemplates';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('Mail transporter verification failed:', error);
  } else {
    console.log('Mail transporter is ready');
  }
});

/**
 * Send email with the given options
 */
export const sendEmail = async (options: MailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      replyTo: process.env.SMTP_REPLY_TO_EMAIL,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export { EmailTemplates };