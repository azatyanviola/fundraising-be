const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');


usersRouter.post('/register', UsersCtrl.usersCreate);
usersRouter.post('/login', UsersCtrl.usersLogin);


module.exports = usersRouter;
