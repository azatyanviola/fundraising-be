const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');


usersRouter.post('/register', UsersCtrl.usersCreate);
usersRouter.post('/login', UsersCtrl.usersLogin);
usersRouter.get('/me', UsersCtrl.getUser);
usersRouter.post('/confirm', UsersCtrl.userActivate);
usersRouter.post('/resend_link', UsersCtrl.resendLink);



module.exports = usersRouter;
