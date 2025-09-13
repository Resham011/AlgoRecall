import nodemailer from 'nodemailer';

/**
 * Sends an email using Nodemailer.
 * @param {object} options - Email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.message - The plain text body of the email.
 * @param {string} options.html - The HTML body of the email.
 * @param {string} options.template - The template type ('welcome', 'verification', 'reset', 'generic').
 * @param {object} options.templateData - Data for the template.
 */
const sendEmail = async (options) => {
  // 1. Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Generate HTML template based on template type
  let htmlContent = options.html;
  if (!htmlContent && options.template) {
    htmlContent = generateHtmlTemplate(options.template, options.templateData);
  }

  // 2. Define the email options
  const mailOptions = {
    from: 'AlgoRecall <noreply@algorecall.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: htmlContent,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

/**
 * Generates HTML email templates
 */
const generateHtmlTemplate = (template, data = {}) => {
  const { name, verificationUrl, resetUrl, expirationTime } = data;
  
  const baseTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AlgoRecall Email</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
          margin: 0;
          padding: 20px;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          padding: 32px 20px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .logo-container {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.15);
          padding: 16px 24px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo-icon {
          width: 32px;
          height: 32px;
          color: white;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        .logo-text {
          color: white;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .tagline {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin-top: 12px;
          font-weight: 400;
        }
        
        .content {
          padding: 40px 32px;
        }
        
        .greeting {
          color: #1f2937;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
          text-align: center;
          letter-spacing: -0.5px;
        }
        
        .message {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 28px;
          text-align: center;
        }
        
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white !important;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          border: none;
          cursor: pointer;
        }
        
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        }
        
        .secondary-text {
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.6;
          margin-top: 32px;
          text-align: center;
        }
        
        .code-container {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
        }
        
        .code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          color: #374151;
          word-break: break-all;
          line-height: 1.5;
        }
        
        .footer {
          background-color: #f8fafc;
          padding: 28px 32px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
          color: #6b7280;
          font-size: 13px;
          margin: 8px 0;
          line-height: 1.5;
        }
        
        .link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .link:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-link {
          color: #6b7280;
          text-decoration: none;
          margin: 0 12px;
          font-size: 13px;
        }
        
        .social-link:hover {
          color: #3b82f6;
        }
        
        @media (max-width: 640px) {
          .content {
            padding: 32px 24px;
          }
          
          .greeting {
            font-size: 24px;
          }
          
          .button {
            padding: 16px 32px;
            font-size: 15px;
          }
          
          .logo-container {
            padding: 12px 20px;
          }
          
          .logo-text {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
         
          <div class="logo-container">
          <span style="display:inline-flex;align-items:center;gap:8px;">
  <!-- Code icon SVG -->
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
    <path d="M7 8L3 12L7 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 8L21 12L17 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 4L9.9 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span style="font-size:20px;font-weight:600;color:white;">AlgoRecall</span>
</span>

          
          </div>

          <p class="tagline">Master coding interviews with spaced repetition</p>
        </div>
        <div class="content">
  `;

  const footerTemplate = `
        </div>
        <div class="footer">
          <p class="footer-text">© 2024 AlgoRecall. All rights reserved.</p>
          <p class="footer-text">If you didn't request this email, please ignore it.</p>
          <p class="footer-text">
            <a href="https://algorecall.com" class="link">Visit our website</a> • 
            <a href="mailto:algorecall@gmail.com" class="link">Contact support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  let mainContent = '';

  switch (template) {
    case 'welcome':
      mainContent = `
        <h2 class="greeting">Welcome to AlgoRecall, ${name || 'there'}! 👋</h2>
        <p class="message">
          We're excited to have you on board! AlgoRecall will help you master coding interviews 
          using spaced repetition to ensure you never forget important algorithms and data structures.
        </p>
        <p class="message">
          Get ready to transform your interview preparation and land your dream tech job!
        </p>
        <div class="button-container">
          <a href="https://algorecall.com/dashboard" class="button">Start Your Journey</a>
        </div>
        <p class="secondary-text">
          If you have any questions, feel free to reply to this email or check out our 
          <a href="https://algorecall.com/help" class="link">help center</a>.
        </p>
      `;
      break;

    case 'verification':
      mainContent = `
        <h2 class="greeting">Verify Your Email Address</h2>
        <p class="message">
          Thank you for signing up with AlgoRecall! To complete your registration and start using 
          our platform, please verify your email address by clicking the button below:
        </p>
        <div class="button-container">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        <p class="secondary-text">
          This verification link will expire in ${expirationTime || '15 minutes'}. 
          If you didn't create an account with AlgoRecall, please ignore this email.
        </p>
        <div class="code-container">
          <p class="secondary-text" style="margin-bottom: 12px;">Or copy and paste this URL in your browser:</p>
          <code class="code">${verificationUrl}</code>
        </div>
      `;
      break;

    case 'reset':
      mainContent = `
        <h2 class="greeting">Reset Your Password</h2>
        <p class="message">
          You recently requested to reset your password for your AlgoRecall account. 
          Click the button below to proceed with resetting your password:
        </p>
        <div class="button-container">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        <p class="secondary-text">
          This password reset link will expire in ${expirationTime || '10 minutes'}. 
          If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>
        <div class="code-container">
          <p class="secondary-text" style="margin-bottom: 12px;">Alternatively, copy and paste this URL in your browser:</p>
          <code class="code">${resetUrl}</code>
        </div>
      `;
      break;

    default:
      mainContent = `
        <h2 class="greeting">Hello${name ? `, ${name}` : ''}!</h2>
        <p class="message">${data.message || 'You have a new message from AlgoRecall.'}</p>
        ${data.actionUrl ? `
          <div class="button-container">
            <a href="${data.actionUrl}" class="button">${data.actionText || 'Take Action'}</a>
          </div>
        ` : ''}
        <p class="secondary-text">${data.additionalText || ''}</p>
      `;
  }

  return baseTemplate + mainContent + footerTemplate;
};

export default sendEmail;