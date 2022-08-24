const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const { SENDGRID_API_KEY: api_key, SENDER_EMAIL: from } = process.env;

const transporter = nodemailer.createTransport(sendgridTransport({ auth: { api_key } }));

const sendMail = (mailOptions = {}) => new Promise((resolve, reject) => {
  transporter.sendMail({ ...mailOptions, from }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  })
});

module.exports = {
  sendMail,
};