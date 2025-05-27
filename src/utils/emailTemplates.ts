interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const EmailTemplates = {
  welcome: (name: string, appName: string = process.env.APP_NAME || 'Our App'): EmailTemplate => ({
    subject: `Welcome to ${appName}, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to ${appName}</h1>
        <p>Hello ${name},</p>
        <p>Thank you for joining ${appName}. We're excited to have you on board!</p>
        <p>Get started by exploring our platform.</p>
        <p style="margin-top: 30px;">Best regards,<br/>The ${appName} Team</p>
      </div>
    `,
    text: `
      Welcome to ${appName}, ${name}!\n\n
      Thank you for joining ${appName}. We're excited to have you on board!\n\n
      Get started by exploring our platform.\n\n
      Best regards,\n
      The ${appName} Team
    `,
  }),

  passwordReset: (
    name: string,
    resetLink: string,
    appName: string = process.env.APP_NAME || 'Our App'
  ): EmailTemplate => ({
    subject: `Password Reset Request for ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset</h1>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password for ${appName}.</p>
        <p style="text-align: center; margin: 25px 0;">
          <a href="${resetLink}" 
             style="background-color: #2563eb; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, please ignore this email.</p>
        <p style="margin-top: 30px;">Best regards,<br/>The ${appName} Team</p>
      </div>
    `,
    text: `
      Password Reset Request\n\n
      Hello ${name},\n\n
      We received a request to reset your password for ${appName}.\n\n
      Please click the following link to reset your password:\n
      ${resetLink}\n\n
      If you didn't request this, please ignore this email.\n\n
      Best regards,\n
      The ${appName} Team
    `,
  }),
};