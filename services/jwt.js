const config = require('../configs/config');
const jwt = require('jsonwebtoken');


function createToken(body) {
    return jwt.sign(body, config.jwt.secretOrKey, {
        expiresIn: config.expiresIn,
    });   
}

module.exports = createToken;