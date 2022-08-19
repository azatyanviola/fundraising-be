const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { Users } = require('../schema/users');
const { getAccessToken, getUserEmail, getUserProfile } = require('../services/methods');
const createToken = require('../services/jwt');
const { sendMail } = require('../services/mailer');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const JWT_SECRET = process.env.secretOrKey;


const userRegisterViaLinkedinAndGoogle = async (req, res) => {
    let newUser;

    try {
        const { name, surname, email, password, isLinkedinUser, isGoogleUser } = res.locals;

            newUser = await Users.create({
                name,
                surname,
                email,
                password,
                role,
                isLinkedinUser,
                isGoogleUser,
            });
        

        const token = createToken({ id: user._id, email: user.email });
        return res.json(token);
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
}




const sendPasswordChangigEmail = async(req, res) => {
        const { email } = req.body;

        const token = createToken({ id: user._id, email: user.email });
        const user = await Users.findOne({email});
        if(user && user.isLinkedinUser) return res.status(400).send("Can't reset the password of Linkedin users");
        if(user && user.isGoogleUser) return res.status(400).send("Can't reset the password of Google users");

        const mailOptions = {
            to: user.email,
            subject: 'Account Verification Link',
            text: `Hello ${req.body.name},
              Please verify your account by clicking the link:
              http://${req.headers.host}/reset-password/${token.token}
              Thank You!`
          };
          try {
            await sendMail(mailOptions);
            console.log('success');
            return res.send({message:'Email has been sent successfuly'});
          } catch (err) {
            console.error('Failed to send email', err);
            res.send({message:'Internal server error'});
          }
    
       }
    
const resetPassword = async(req, res) => {
    const { email } = res.locals;

    try {
        const { password } = req.body;
        const user = await Users.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        return res.sendStatus(200);
    }
    catch(err) {
        return res.status(422).send({message:'Email has been sent successfuly'});
    }
}


const linkedinAuthentication = async (req, res) => {
    const { code, redirect_uri, userToken } = req.body;
    if(!code || !redirect_uri) return res.status(400).send('Missing required parameters');

    try {
        const accessToken = await getAccessToken(code, redirect_uri);
        const { name, surname} = await getUserProfile(accessToken);
        const userEmail = await getUserEmail(accessToken);
        if (userToken) {
             jwt.verify(userToken, JWT_SECRET);
        }
        if (!accessToken || !firstName|| !lastName || !userEmail) {
            return res.status(401).send('Authorization failed');
        }

        const user = await Users.findOne({ email: userEmail });
        if (user) {
            
            const token = createToken({ id: user._id, email: user.email });
            return res.json({
                isRegistered: true,
                token
            })
        }

        const token = jwt.sign({
            email: userEmail,
            isLinkedinUser: true,
            firstName,
            lastName,
        }, JWT_SECRET, { expiresIn: '30d'});

        return res.json({
            isRegistered: false,
            token
        });
    }
    catch (err) {
        return res.status(401).send('Authorization failed');
    }
}


const googleAuthentication = async (req, res) => {
    const { tokenId, userToken }  = req.body;
    if(!tokenId) return res.status(400).send('tokenId is required');

    try {
        if (userToken) {
             jwt.verify(userToken, JWT_SECRET).by;
        }
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.CLIENT_ID
        });

        const { name, email } = ticket.getPayload();

        const user = await Users.findOne({ email });
        if (user) {
            const token = createToken({ id: user._id, email: user.email });
            return res.json({
                isRegistered: true,
                token
            })
        }

        const token = jwt.sign({
            email,
            name: name.split(' ')[0],
            surname: name.split(' ')[1],
            isGoogleUser: true,
        }, JWT_SECRET, { expiresIn: '30d'});
        
        return res.json({
            isRegistered: false,
            token
        });
    }
    catch (err) {
        return res.status(401).send('Authorization failed');
    }
}


module.exports = {
    sendPasswordChangigEmail,
    resetPassword,
    linkedinAuthentication,
    googleAuthentication,
    userRegisterViaLinkedinAndGoogle 
}


