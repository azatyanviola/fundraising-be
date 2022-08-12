const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');
const { jwtAuth } = require('../services/jwtAuth');


usersRouter.post('/register', UsersCtrl.usersCreate);
usersRouter.post('/login', UsersCtrl.usersLogin);
usersRouter.get('/me', UsersCtrl.getUser);
usersRouter.get('/confirm', jwtAuth, UsersCtrl.userActivate);



module.exports = usersRouter;
