const Users = require('../schema/users');
const bcrypt = require('bcrypt');
const { emailRegex, passwordRegex } = require('../validation/regEx');
const createToken = require('../services/jwt');
const { sendMail } = require('../services/mailer');

console.log()

class UsersCtrl {
  static async usersCreate(req, res) {
    const { email } = req.body;
    if (!emailRegex.test(email)) {
      return res
        .status(406)
        .send({ message: 'Not acceptable user' });
    }
    if (!passwordRegex.test(req.body.password)) {
      return res
        .status(406)
        .send({ message: 'Not acceptable user' });
    }
    let user = await Users.findOne({
      email,
    })
      .lean()
      .exec();
    if (user) {
      return res.status(400).send({ message: 'User already exist' });
    } else {

      user = await Users.create({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      res.status(201).send({
         data:[ 
          user.name,
          user.surname, 
          user.email
         ]
      });

      const token = createToken({ id: user._id, email: user.email });
      const mailOptions = {
        to: user.email,
        subject: 'Account Verification Link',
        text: `Hello ${req.body.name},
          Please verify your account by clicking the link:
          http://localhost/3000/confirm/${token.token}
          Thank You!`
      };
      try {
        await sendMail(mailOptions);
        console.log('success');
      } catch (err) {
        console.error('Failed to send email', err);
        res.send({ succuss: false, err });
      }
    }
  }


  static async usersLogin(req, res) {
    const { email } = req.body;
    try {
      const user = await Users.findOne({
        email,
      })
        .lean()
        .exec();
      if (!user.isVerified) {
          return res.status(401).send({ message: 'Your Email has not been verified. Please click on resend' });
      }
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = createToken({ id: user._id, email: user.email });

        return res
          .status(200)
          .send({
            data: token,
          });
      }
 else {
        return res
          .status(404)
          .send({ message: 'User not found' });
      }
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Internal server error' });
    }
  }


  static async getUser(req, res) {
    const { id } = req.params;

    const user = await Users.findOne({ _id: id });

    return res.send({
      data:[ 
        user.name,
        user.surname, 
        user.email
       ]
    });
  }


  static async userActivate(req, res, next) {
    const { token } = req.body.token;
    // token is not found into database i.e. token may have expired 
    if (!token) {
      return res.status(400).send({ message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    }
    // if token is found then check valid user 
    else {
      Users.findOne({ _id: token._userId, email: req.body }, function (err, user) {
        // not valid user
        if (!user) {
          return res.status(401).send({ message: 'We were unable to find a user for this verification. Please SignUp!' });
        }
        // user is already verified
        else if (user.isVerified) {
          return res.status(200).send({ message: 'User has been already verified. Please Login' });
        }
        // verify user
        else {
          // change isVerified to true
          user.isVerified = true;
          user.save(function (err) {
            // error occur
            if (err) {
              return res.status(500).send({ message: err.message });
            }
            // account successfully verified
            else {
              return res.status(200).send({ message: 'Your account has been successfully verified' });
            }
          });
        }
      });
    }

  }

  static async resendLink(req, res, next) {

    Users.findOne({ email: req.body.email }, function (err, user) {
      // user is not found into database
      if (!user) {
        return res.status(400).send({ message: 'We were unable to find a user with that email. Make sure your Email is correct!' });
      }
      // user has been already verified
      else if (user.isVerified) {
        return res.status(200).send({ message: 'This account has been already verified. Please log in.' });

      }
      // send verification link
      else {
        // generate token and save
        const token = createToken({ id: user._id, email: user.email });

        // Send email (use credintials of SendGrid)
        const mailOptions = {
          to: user.email,
          subject: 'Account Verification Link',
          text: `Hello ${req.body.name},
            Please verify your account by clicking the link:
            http://localhost/3000/confirm/${token.token}
            Thank You!`
        };
       sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({ message: 'Technical Issue!, Please click on resend for verify your Email.' });
          }
          return res.status(200).send({ message: 'A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.' });
        });
      }
    });
  }

}



module.exports = { UsersCtrl };

