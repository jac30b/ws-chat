const jwt = require('jsonwebtoken');

function Auth() {}

Auth.generateToken = (user) => {
    return jwt.sign({
        data: user
      }, 'jeeezzz', { expiresIn: '1h' });
}

module.exports.Auth = Auth;