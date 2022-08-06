const Users = require('../schema/users');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function createToken(body) {
    return jwt.sign(body, config.jwt.secretOrKey, {
        expiresIn: config.expiresIn,
    });   
}
const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/;


class UsersCtrl {
    static async usersCreate(req, res) {
        try {
            let user = await Users.findOne({
                email: req.body.email
            })
                .lean()
                .exec();
            if (user) {
                return res.status(400).send({ message: 'User already exist' });
            }

            user = await Users.create({
                name: req.body.username,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body. confirmPassword,
                role: req.body.role
            });
            if (!emailRegex.test(req.body.email)){
                return res.send({ message: 'The email does not match' });
            }
            if (!passwordRegex.test(req.body.password)){
                return res.send({ message: 'The password does not match' });
            }

            if(req.body.password !== req.body.confirmPassword){
                return res.send({ message: 'Passwords must be the same' });
              }

            const token = createToken({ id: user._id, email: user.email });

            res.cookie('token', token, {
                httpOnly: true,
            });

            res.status(200).send({
                data: user,
            });
        } catch (err) {

            console.error('E, register,', err);
            res.status(500).send({ message: 'some error' });
        }
    }


    static async  usersLogin(req, res) {
        try {
            const user = await Users.findOne({
                email: req.body.email,
            })
                .lean()
                .exec();
            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({ id: user._id, email: user.email });
                res.cookie('token', token, {
                    httpOnly: true,
                });

                res
                    .status(200)
                    .send({
                        data: token,
                    });
            } else {
                res
                    .status(400)
                    .send({ message: 'User not exist or password not correct' });
            }
        } catch (err) {
            console.error('E, login,', err);
            res
                .status(500)
                .send({ message: 'some error' });
        }
    }
}

module.exports = {
    UsersCtrl,
};
