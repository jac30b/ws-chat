const http = require('http');
const {WebSocketServer} = require("ws");
const urlParser = require("url-parse");
const qs = require("qs");
const jwt = require("jsonwebtoken");
const {isJwtExpired} = require("jwt-check-expiration");
const {Parser} = require('./Parser');
const {Auth} = require('./Auth');

class MyServer {
    constructor(router) {
        this.router = router;
    }
    start(port){
        const requestListener = async (req, res) => {
            let requestData = '';
            req.on('data', (chunk) => {
                requestData += chunk.toString();
            });

            req.on('end', () => {
                const resolved = this.router.resolve(req);

                if(resolved === null) {
                    res.writeHead(500, "Wrong path");
                    res.end("Request not resolved - Wrong Path");
                    return;
                }
                resolved.catch((error) => {
                    return {result: error.toString(), status: 500}
                }).then(({status = 200, headers = {"Content-Type": "text/plain"}, result}) => {
                    res.writeHead(status, headers);
                    res.end(result);
                });
            });
        }

        const server = http.createServer(requestListener);
        const wss = new WebSocketServer({server});

        wss.on('connection', function conn(ws, req){
            const parsedUrl = new urlParser(req.url);
            const parsedParams = qs.parse(parsedUrl.query, {ignoreQueryPrefix: true});

            try {
                const userData = Auth.validateData(parsedParams.token);
                ws.roomID = userData.roomID;
                ws.user = userData.user;
            } catch (err) {
                ws.send(err.message);
                return ws.terminate();
            }

            ws.on('message',async  function incoming(message){
                try {
                    const data = {body: message.toString(), roomID: ws.roomID, user:ws.user}
                    Parser.parse(data).then(async (req) => {
                        await MyServer.broadcastMessage(wss, req.message, req.roomID);
                    }).catch((err) => {
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }


            });
        });
        server.listen(port);
    }

    static async broadcastMessage(wss, message, roomID) {
        wss.clients.forEach((client) => {
            if(client.readyState === 1 && client.roomID === roomID) {
                client.send(message);
            }
        });
    }
}

module.exports.MyServer = MyServer;