const passwordResetMail = ({
    email,
    username,
    token,
    req,
}) => ({
    to: email,
    subject: 'Magic login Link',
    text: `Hello ${username},
      Please verify your account by clicking the link:
      http://${req.headers.host}/reset-password/${token}
      Thank You!`
});

const registerMail = ({
    email,
    username,
    token,
    req,
}) => ({
    to: email,
    subject: 'Account Verification Link',
    text: `Hello ${username},
      Please verify your account by clicking the link:
      http://${req.headers.host}/confirm/${token}
      Thank You!`
});

module.exports = {passwordResetMail, registerMail}