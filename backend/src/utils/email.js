const sendEmail = async (options) => {
    // In a real application, you would use a service like SendGrid or Nodemailer
    // For this demo/MVP, we will log the email content to the console

    console.log('--- EMAIL SENT ---');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: \n${options.message}`);
    console.log('------------------');
};

module.exports = sendEmail;
