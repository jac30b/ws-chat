const jwt = require('jsonwebtoken');
const {Room} = require('./Room');
const {isJwtExpired} = require("jwt-check-expiration");

class Auth {
    static async generateToken(user, roomID) {
        const room = new Room();
        return room.addRoom(roomID).catch((err) => {
            throw err;
        }).then(async () => {
            return await jwt.sign({user: user, roomID: roomID}, 'jeeezzz', {expiresIn: '1h'});
        });
    }

    static validateData(token) {
        if (token) {
            const dataFromToken = jwt.verify(token, 'jeeezzz');
            if (dataFromToken.roomID && dataFromToken.user && !isJwtExpired(token)) {
                return dataFromToken;
            } else {
                throw new Error("Wrong data in token provided");
            }
        } else {
            throw new Error("No token provided");
        }
    }
}

module.exports.Auth = Auth;