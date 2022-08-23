const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');


usersRouter.post('/register', UsersCtrl.usersCreate);
usersRouter.post('/login', UsersCtrl.usersLogin);
usersRouter.post('/me', UsersCtrl.getUser);
usersRouter.post('/confirm', UsersCtrl.userActivate);
usersRouter.post('/resend_link', UsersCtrl.resendLink);
usersRouter.post('/magic_login', UsersCtrl.magicLogin);
usersRouter.post('/reset_password', UsersCtrl.resetPassword);



module.exports = usersRouter;
