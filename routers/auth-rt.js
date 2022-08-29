const authRouter = require('express').Router();
const {  googleAuthentication, linkedinAuthentication, userRegisterViaLinkedinAndGoogle } = require('../controllers/auth-ctr');



authRouter.post('/register', userRegisterViaLinkedinAndGoogle);
authRouter.post('/linkedin', linkedinAuthentication);
authRouter.post('/google', googleAuthentication );




module.exports = authRouter;