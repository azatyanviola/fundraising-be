const Users = require('../schema/users');
const bcrypt = require('bcrypt');
const regEx = require('../validation/regEx');
const createToken = require('../services/jwt');


const emailRegex = regEx.emailRegex;
const passwordRegex = regEx.passwordRegex;


class UsersCtrl {
    static async usersCreate(req, res) {
        if (!emailRegex.test(req.body.email)){
            return res
                    .status(406)
                    .send({ message: 'Not acceptable user' });
        }
        if (!passwordRegex.test(req.body.password)){
            return res
                   .status(406)
                   .send({ message: 'Not acceptable user' });
        }
        try {
            const {email} = req.body.email;
            let user = await Users.findOne({
                 email,
            })
                .lean()
                .exec();
            if (user) {
                return res.status(400).send({ message: 'User already exist' });
            }

            user = await Users.create({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });

            const token = createToken({ id: user._id, email: user.email });

            res.cookie('token', token, {
                httpOnly: true,
            });

            res.status(201).send({
                data: user,
            });
        } catch (err) {
            res
              .status(500)
              .send({ message: 'Internal server error' });
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

                return res
                    .status(200)
                    .send({
                        data: token,
                    });
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
}

module.exports = {UsersCtrl};

