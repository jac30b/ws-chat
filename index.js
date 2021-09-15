const http = require('http');
const fs = require('fs');
const {WebSocketServer} = require('ws');
const {Parser} = require('./scripts/Parser');
const {Request} = require('./scripts/Request');
const {Router} = require('./scripts/Router')
const qs = require('qs');
const urlParser = require('url-parse');

const requestListener = (req, res) => {
    if(req.method == 'GET') {
        let requestData = '';
        req.on('data', (chunk) => {
            requestData += chunk.toString();
        });
    
        req.on('end', () => {
            console.log(requestData);
        });

        const result = Router.route(req.url, requestData);
        res.end(result);
    }
}

const server = http.createServer(requestListener);
const wss = new WebSocketServer({server});

// TODO: Store rooms somewhere

wss.on('connection', function conn(ws, req){
    const parsedUrl = new urlParser(req.url);
    const parsedParams = qs.parse(parsedUrl.query, {ignoreQueryPrefix: true});

    if(!parsedParams.token){
        ws.send('No token provided');
        return ws.terminate();
    }

    ws.room = 0; // TODO: get room 

    ws.on('message', function incoming(message){
        const parser = new Parser();
        const req = parser.parse(message);
        
        broadcastMessage(wss, req.message);
    });
});



async function broadcastMessage(wss, message) {
    wss.clients.forEach((client) => {
        if(client.readyState === 1) {
            client.send(message);
        }
    });
}

server.listen(8080);