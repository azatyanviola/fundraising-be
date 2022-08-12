const Users = require('../schema/users');
const bcrypt = require('bcrypt');
const regEx = require('../validation/regEx');
const createToken = require('../services/jwt');
require('dotenv').config();
const { sendEmail } = require('../services/mailer.js');



const emailRegex = regEx.emailRegex;
const passwordRegex = regEx.passwordRegex;


class UsersCtrl {
    static async usersCreate(req, res) {
        console.log(req.body);
        const {email} = req.body;
        try {
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
            }

            user = await Users.create({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });

            const token = createToken({ id: user._id, email: user.email });
    
            const html = `
                <img 
                    alt="Header" 
                    style="
                        width: 600px; 
                        height: 200px"
                >
                <h3>Hey there</h3>
                <p>You recently registered on startupfundraising.eu with this email address ${email}.</p>
                <p>To confirm this email address, please push the confirm button below.</p>
                <p><a target="_" href="${DOMAIN}/confirm/${token}">
                    <button style="
                        cursor: pointer; 
                        height: 42px; 
                        width: 110px; 
                        background-color: #0077B5; 
                        border-radius: 8px; 
                        border: none; 
                        color: white"
                    >Confirm</button>
                </a></p>
            `;
    
            await sendEmail({toUser: user, sendingInfo: {
                subject: "You're almost there...",
                html
            }});

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


    static async userActivate(req, res) {
        const { id } = res.locals;
        let newUser;
    
        try {
            const deletedUser = await Users.findByIdAndRemove(id);
            const { name, surname, email, password, role } = deletedUser;
            
                newUser = await Users.create({
                    name,
                    surname,
                    email,
                    password,
                    role
                });
    
            const token = createToken({ id: user._id, email: user.email });
    
            return res.json(token); 
        }
        catch (err) {
            return res.status(422).send(err.message);
        }
    }
    

}
module.exports = {UsersCtrl};

