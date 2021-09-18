const http = require('http');
const fs = require('fs');
const {Parser} = require('./src/Parser');
const {Request} = require('./src/Request');
const {Router} = require('./src/Router')
const qs = require('qs');
const urlParser = require('url-parse');
const jwt = require('jsonwebtoken');
const { isJwtExpired }  = require('jwt-check-expiration');
const {Auth} = require("./src/Auth");
const {Room} = require("./src/Room");
const {MyServer} = require('./src/MyServer');

const router = new Router();

router.addRoute('GET', new RegExp('/login'), async (userData) => {
    return {result: await Auth.generateToken(userData.user, userData.roomID)};
})

router.addRoute('GET', new RegExp('/getRooms'), async () => {
    const room = new Room();
    return {result: await room.getRooms()};
});

new MyServer(router).start(8080);
