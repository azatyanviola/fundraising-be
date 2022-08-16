const Users = require('../schema/users');
const bcrypt = require('bcrypt');
const regEx = require('../validation/regEx');
const createToken = require('../services/jwt');
require('dotenv').config();
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');



const emailRegex = regEx.emailRegex;
const passwordRegex = regEx.passwordRegex;


class UsersCtrl {
    static async usersCreate(req, res) {
        const {email} = req.body;
            if (!emailRegex.test(email)){
                return res
                        .status(406)
                        .send({ message: 'Not acceptable user' });
            }
            if (!passwordRegex.test(req.body.password)){
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
            }else {

            user = await Users.create({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });

            res.status(201).send({
                data: user,
            });
         
        const token = createToken({ id: user._id, email: user.email });

        // Send email (use credintials of SendGrid)
        const transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        const mailOptions = { from: 'ani@startupbenefits.eu', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
        }

    }
    static async  usersLogin(req, res) {
        const {email} = req.body;
        try {
            const user = await Users.findOne({
                email,
            })
                .lean()
                .exec();
            if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = createToken({ id: user._id, email: user.email });
                
                return res
                    .status(200)
                    .send({
                        data: token,
                    });
            } else if (!user.isVerified){
                return res.status(401).send({msg:'Your Email has not been verified. Please click on resend'});
            } else {
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
            data:user,
        });
    }


    static async userActivate (req, res, next) {
        const {token} = req.body.token;
            // token is not found into database i.e. token may have expired 
            if (!token){
                return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
            }
            // if token is found then check valid user 
            else{
                Users.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
                    // not valid user
                    if (!user){
                        return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
                    } 
                    // user is already verified
                    else if (user.isVerified){
                        return res.status(200).send('User has been already verified. Please Login');
                    }
                    // verify user
                    else{
                        // change isVerified to true
                        user.isVerified = true;
                        user.save(function (err) {
                            // error occur
                            if(err){
                                return res.status(500).send({msg: err.message});
                            }
                            // account successfully verified
                            else{
                              return res.status(200).send('Your account has been successfully verified');
                            }
                        });
                    }
                });
            }
            
    }
    
    static async resendLink (req, res, next) {

        Users.findOne({ email: req.body.email }, function (err, user) {
            // user is not found into database
            if (!user){
                return res.status(400).send({msg:'We were unable to find a user with that email. Make sure your Email is correct!'});
            }
            // user has been already verified
            else if (user.isVerified){
                return res.status(200).send('This account has been already verified. Please log in.');
        
            } 
            // send verification link
            else{
                // generate token and save
                const token = createToken({ id: user._id, email: user.email });
        
                    // Send email (use credintials of SendGrid)
                        const transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                        const mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
                        transporter.sendMail(mailOptions, function (err) {
                           if (err) { 
                            return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                         }
                        return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                    });
                }
            });
        }
  
 }
       
    

module.exports = {UsersCtrl};

