const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');
const createToken = require('../services/jwt');


usersRouter.post('/register', UsersCtrl.usersCreate);
usersRouter.post('/login', UsersCtrl.usersLogin);
usersRouter.get('/me', UsersCtrl.getUser);



module.exports = usersRouter;
