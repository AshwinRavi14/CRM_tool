const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
    // Check if SMTP configuration is provided
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        logger.info('--- EMAIL LOGGED (NO SMTP CONFIGURED) ---');
        logger.info(`To: ${options.email}`);
        logger.info(`Subject: ${options.subject}`);
        logger.info(`Message: \n${options.message}`);
        logger.info('------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `Wersel CRM <${process.env.FROM_EMAIL || 'noreply@wersel.ai'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
