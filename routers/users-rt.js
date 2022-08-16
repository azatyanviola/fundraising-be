const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');


usersRouter.post('/register', UsersCtrl.usersCreate);
usersRouter.post('/login', UsersCtrl.usersLogin);
usersRouter.get('/me', UsersCtrl.getUser);
usersRouter.get('/confirm/:email/:token', UsersCtrl.userActivate);
usersRouter.post('/resendLink', UsersCtrl.resendLink);



module.exports = usersRouter;
