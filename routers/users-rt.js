const usersRouter = require('express').Router();
const { UsersCtrl } = require('../controllers/users-ctr');


usersRouter.post('/auth/register', UsersCtrl.usersCreate);


module.exports = usersRouter;
