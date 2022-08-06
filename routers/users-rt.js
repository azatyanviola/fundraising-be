const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');


usersRouter.post('/auth/register', UsersCtrl.usersCreate);
usersRouter.post('/auth/login', UsersCtrl.usersLogin);


module.exports = usersRouter;
