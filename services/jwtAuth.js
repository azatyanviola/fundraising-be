const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.jwtAuth = function(req, res, next) {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const info = jwt.verify(token, process.env.JWT_SECRET);

        res.locals = info;
        next();
    }
    catch(err) {
        return res.status(401).send('Authorization failed');
    }
}