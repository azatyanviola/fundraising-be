const authRouter = require('express').Router();
const passport = require('passport');
const { jwtAuth } = require('../services/jwtAuth');
const { googleAuthentication, linkedinAuthentication, userRegisterViaLinkedinAndGoogle } = require('../controllers/auth-ctr');



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