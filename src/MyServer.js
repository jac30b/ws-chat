const http = require('http');
const {WebSocketServer} = require("ws");
const urlParser = require("url-parse");
const qs = require("qs");
const {Parser} = require('./Parser');
const {Auth} = require('./Auth');

class MyServer {
    constructor(router) {
        this.router = router;
    }

    static async broadcastMessage(wss, message, roomID, userToExclude = null) {
        wss.clients.forEach((client) => {
            if (client.readyState === 1 && client.roomID === roomID) {
                if (!(userToExclude !== null && client.user === userToExclude)) {
                    client.send(message);
                }
            }
        });
    }


    static getUsersFromRoom(wss, roomID) {
        let clients = [];
        wss.clients.forEach((client) => {
            if (client.readyState === 1 && client.roomID === roomID) {
                clients.push(client.user);
            }
        });
        return clients;
    }

    start(port) {
        const requestListener = async (req, res) => {
            let requestData = '';
            req.on('data', (chunk) => {
                requestData += chunk.toString();
            });

            req.on('end', () => {
                const resolved = this.router.resolve(req);

                if (resolved === null) {
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

            req.on('error', (err) => {
                res.writeHead(status, {status: 500, headers: {"Content-Type": "text/plain"}});
                res.end(err.message);
            });
        }

        const server = http.createServer(requestListener);
        const wss = new WebSocketServer({noServer: true});

        server.on('upgrade', (request, socket, head) => {
            const parsedUrl = new urlParser(request.url);
            const parsedParams = qs.parse(parsedUrl.query, {ignoreQueryPrefix: true});

            const authenticate = (req, cb) => {
                try {
                    const userData = Auth.validateData(parsedParams.token);
                    cb(false, userData);
                } catch (err) {
                    cb(err, null);
                }
            };

            authenticate(request, (err, userData) => {
                if (err) {
                    console.error(err.message);
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                }

                wss.handleUpgrade(request, socket, head, function done(ws) {
                    ws.roomID = userData.roomID;
                    ws.user = userData.user;
                    wss.emit('connection', ws);
                });
            });
        });

        wss.on('connection', function conn(ws) {
            ws.on('message', async function incoming(message) {
                try {
                    const data = {body: message.toString(), roomID: ws.roomID, user: ws.user}
                    Parser.parse(data).then(async (req) => {
                        if(req.method === 'sendMessage'){
                            await MyServer.broadcastMessage(wss, JSON.stringify({"message": req.message}), req.roomID, req.user);
                            ws.send(JSON.stringify({status: "ok", message: req.message}));
                        } else if(req.method === 'getUsers') {
                            const users = MyServer.getUsersFromRoom(wss, req.roomID);
                            ws.send(JSON.stringify({status: "ok", users: users}));
                        }
                    }).catch((err) => {
                        console.error(err);
                        ws.send(JSON.stringify({status: "error", message: err}));
                    });
                } catch (err) {
                    console.error(err);
                }


            });
        });
        server.listen(port);
    }
}

module.exports.MyServer = MyServer;