const http = require('http');
const fs = require('fs');
const {WebSocketServer} = require('ws');
const {Parser} = require('./scripts/Parser');
const {Request} = require('./scripts/Request');
const {Router} = require('./scripts/Router')
const qs = require('qs');
const urlParser = require('url-parse');
const jwt = require('jsonwebtoken');
const { isJwtExpired }  = require('jwt-check-expiration');

const requestListener = async (req, res) => {
    if(req.method == 'GET') {
        let requestData = '';
        req.on('data', (chunk) => {
            requestData += chunk.toString();
        });
    
        req.on('end', () => {
            console.log(requestData);
        });

        const result = await Router.route(req.url, requestData);
        res.end(result);
    }
}

const server = http.createServer(requestListener);
const wss = new WebSocketServer({server});

wss.on('connection', function conn(ws, req){
    const parsedUrl = new urlParser(req.url);
    const parsedParams = qs.parse(parsedUrl.query, {ignoreQueryPrefix: true});

    if(!parsedParams.token){
        ws.send('No token provided');
        return ws.terminate();
    }

    const dataFromToken = jwt.verify(parsedParams.token, 'jeeezzz');

    if(isJwtExpired(parsedParams.token)){
        ws.send('Token expired');
        return ws.terminate();
    }

    ws.roomID = dataFromToken.roomID;

    ws.on('message', function incoming(message){
        const parser = new Parser();
        const req = parser.parse(message);``

        broadcastMessage(wss, req.message, ws.roomID);

    });
});



async function broadcastMessage(wss, message, roomID) {
    wss.clients.forEach((client) => {
        if(client.readyState === 1 && client.roomID === roomID) {
            client.send(message);
        }
    });
}

server.listen(8080);