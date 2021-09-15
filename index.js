const http = require('http');
const fs = require('fs');
const {WebSocketServer} = require('ws');
const {Parser} = require('./scripts/Parser');

const server = http.createServer({});
const wss = new WebSocketServer({server});

wss.on('connection', function conn(ws, req){
    ws.on('message', function incoming(message){
        const parser = new Parser();
        const req = parser.parse(message);
        console.log(req);
    });
});

server.listen(8080);