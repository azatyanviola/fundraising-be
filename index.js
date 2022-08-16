require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('./configs/config');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const { jwt } = require('./configs/config');
const usersRouter = require('./routers/users-rt');
const authRouter = require('./routers/auth-rt');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);


(async () => {
    await mongoose.connect(process.env.DB_URL);
    await server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
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
app.use('/auth', usersRouter);
app.use('/auth', authRouter);
app.use(cors({
    origin: '*'
}));


