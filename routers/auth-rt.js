const authRouter = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { jwtAuth } = require('../services/jwtAuth');
const { sendPasswordChangigEmail, resetPassword, googleAuthentication, linkedinAuthentication, userRegisterViaLinkedinAndGoogle } = require('../controllers/auth-ctr');



authRouter.post('/magic_login', sendPasswordChangigEmail);
authRouter.post('/reset-password', jwtAuth, resetPassword);
authRouter.post('/register', jwtAuth, userRegisterViaLinkedinAndGoogle);
authRouter.post('/linkedin', linkedinAuthentication);
authRouter.post('/google', googleAuthentication );



passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(user, done) {
done(null, user);
});

  module.exports = authRouter;