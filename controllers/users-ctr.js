const Users = require('../schema/users');
const bcrypt = require('bcrypt');
const { emailRegex, passwordRegex } = require('../validation/regEx');
const createToken = require('../services/jwt');
const { sendMail } = require('../services/mailer');
const jwt = require('jsonwebtoken');
const { passwordResetMail, registerMail } = require('../mailOptions/mailOptions');

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
        data: [
          user.name,
          user.surname,
          user.email,
          user.role
        ]
      });

      const token = createToken({ id: user._id, email: user.email });
      const mailOptions = registerMail({
        email: user.email,
        username: req.body.name,
        token,
        req
      })
      // const mailOptions = {
      //   to: user.email,
      //   subject: 'Account Verification Link',
      //   text: `Hello ${req.body.name},
      //     Please verify your account by clicking the link:
      //     http://${req.headers.host}/confirm/${token}
      //     Thank You!`
      // };
      try {
        await sendMail(mailOptions);
        console.log('success');
      } catch (err) {
        console.error('Failed to send email', err);
        res.send({ message: 'Internal server error' });
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
    const { token } = req.body;
    const { id } = jwt.decode(token);
    const user = await Users.findOne({ _id: id });
    console.log(user);
    return res.send({
      data: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
      }
    });
  }


  static async userActivate(req, res, next) {
    const { token } = req.body;
    // token is not found into database i.e. token may have expired
    if (!token) {
      return res.status(400).send({ message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    }
    // if token is found then check valid user
    else {
      const { id, email } = jwt.decode(token);
      console.log(id, email, "id", "email");
      let user;
      try {
        user = await Users.findOne({ id, email });
      } catch (err) {
        console.log(err)
      };
      console.log(user, "user")
      // not valid user
      if (!user) {
        return res.status(401).send({ message: 'We were unable to find a user for this verification. Please SignUp!' });
      }
      // user is already verified
      else if (user.isVerified) {
        return res.status(200).send({ data: token });
      }
      // verify user
      else {
        // change isVerified to true
        user.isVerified = true;
        user.save()
        // account successfully verified
        console.log(user, "veryfied-user");
        return res.status(200).send({ message: 'Your account has been successfully verified' });


      }
    }

  }

  static async resendLink(req, res, next) {
    const { email, process } = req.body;
    let user;
    try {
      user = await Users.findOne({ email: email });
    } catch (err) {
      console.log(err)
    };
    console.log(user, "user")
    if (!user) {
      return res.status(400).send({ message: 'We were unable to find a user with that email. Make sure your Email is correct!' });
    }
    // user has been already verified
    else if (process === "register" && user.isVerified) {
      return res.status(200).send({ message: 'This account has been already verified. Please log in.' });
    }
    // send verification link
    else {
      // generate token and save
      const token = createToken({ id: user._id, email: user.email });
      const mailOptions = process === "register" ?
        registerMail({
          email: user.email,
          username: req.body.name,
          token,
          req
        }) :
        passwordResetMail({
          email: user.email,
          username: req.body.name,
          token,
          req
        })
      try {
        await sendMail(mailOptions);
        console.log('success');
        res.status(200).send({ message: 'Success' });
      } catch (err) {
        console.error('Failed to send email', err);
        res.send({ message: 'Internal server error' });
      }
    }
  }



  static async resendLinkMagicLogin(req, res, next) {
    const { email } = req.body;
    console.log(email, "email");
    let user;
    try {
      user = await Users.findOne({ email: email });
    } catch (err) {
      console.log(err)
    };
    console.log(user, "user")
    if (!user) {
      return res.status(400).send({ message: 'We were unable to find a user with that email. Make sure your Email is correct!' });
    } else {
      // generate token and save
      const token = createToken({ id: user._id, email: user.email });
      const mailOptions = registerMail({
        email: user.email,
        username: user.name,
        token,
        req
      })
      try {
        await sendMail(mailOptions);
        console.log('success');
        res.status(200).send({ message: 'Success' });
      } catch (err) {
        console.error('Failed to send email', err);
        res.send({ message: 'Internal server error' });
      }
    }
  }



  static async magicLogin(req, res) {
    const { email } = req.body;
    console.log(req.body);
    const user = await Users.findOne({
      email,
    })

    console.log(user);
    const token = createToken({ id: user._id, email: user.email });
    // const mailOptions = {
    //     to: user.email,
    //     subject: 'Magic login Link',
    //     text: `Hello ${user.name},
    //       Please verify your account by clicking the link:
    //       http://${req.headers.host}/reset-password/${token}
    //       Thank You!`
    //   };
    const mailOptions = registerMail({
      email: user.email,
      username: user.name,
      token,
      req
    })
    try {
      await sendMail(mailOptions);
      console.log('success');
      return res.send({ message: 'Email has been sent successfuly' });
    } catch (err) {
      console.error('Failed to send email', err);
      res.send({ message: 'Internal server error' });
    }
  }

  static async resetPassword(req, res) {
    const { token } = req.body;
    const { id } = jwt.decode(token);
    let user = await Users.findOne({
      id,
    })
    const { confirmPassword } = req.body;
    const hashedPassoword = await bcrypt.hash(confirmPassword, 12);
    user.password = hashedPassoword;
    await user.save();
    return res.status(200).send({ data: token });
  }
  catch(err) {
    return res.status(500).send({ message: 'Internal server error' });
  }

}



module.exports = { UsersCtrl };

