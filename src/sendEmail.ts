// sendEmail.ts

import nodemailer from 'nodemailer';

// 1. Define transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aravind2381@gmail.com',      // <-- Replace with your Gmail address
    pass: 'aravind23814640'        // <-- Replace with your Gmail password or App Password
  }
});

// 2. Define mail options
const mailOptions = {
  from: 'aravind2381@gmail.com',        // <-- Replace with your Gmail address
  to: 'internrelated@gmail.com',         // <-- Replace with recipient's email address
  subject: 'Test Email from Nodemailer (TypeScript)',
  text: 'Hello! This is a test email sent from Node.js using Nodemailer and TypeScript.',
  // html: '<h1>Hello!</h1><p>This is a test email sent from Node.js using Nodemailer and TypeScript.</p>' // Optional: HTML body
};

// 3. Send the email
transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
