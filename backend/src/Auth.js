const jwt = require('jsonwebtoken');
const {format} = require('date-fns');
const {Room} = require('./Room');

class Auth {
    static async generateToken(user, roomID) {
        const room = new Room();
        return room.addRoom(roomID).catch((err) => {
            throw err;
        }).then(async () => {
            return await jwt.sign({user: user, roomID: roomID}, 'jeeezzz', {expiresIn: '1h'});
        });
    }
}

module.exports.Auth = Auth;