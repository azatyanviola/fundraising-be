const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendEmail = async function({toUser: { email }, sendingInfo}) {
  const { subject, html } = sendingInfo;

  const msg = {
    to: email,
    from: EMAIL, 
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error(`Failed to send email to ${email}`);
  }
};