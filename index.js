require('dotenv').config();
const PORT = process.env.PORT || 3001;

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('./controllers/config');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const { jwt } = require('./controllers/config');
const path = require('path');

const db = {
    url: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

(async () => {
    await mongoose.connect(db.url);
})();

passport.use(new Strategy(jwt, ((jwtPayload, done) => {
    if (jwtPayload !== void 0) {
        return done(false, jwtPayload);
    }
    done();
})));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usersRouter = require('./routers/users-rt');
app.use('/', usersRouter);





server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
