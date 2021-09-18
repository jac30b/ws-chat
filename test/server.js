const {expect}  = require("chai");
const request = require("request");
const jwt = require("jsonwebtoken");
const {WebSocket} = require('ws')
const {debug_mode} = require("redis");
const {MongoClient} = require('mongodb');

const debug = process.argv.includes('-debug');

describe("Login to server", () => {
   const mainUrl = 'http://localhost:8080';
   it("Should return the JWT token.", () => {
          request(mainUrl.concat('/login/?user=test&roomID=0'), {method: "GET"}, (error, response, body) =>{
             expect(response.statusCode).to.equal(200);
             expect(body).to.not.equal(null);
             const params = jwt.verify(body, 'jeeezzz');
             expect(params).to.have.property('user').that.is.not.null;
             expect(params).to.have.property('roomID').that.is.not.null;
          });
   });

   it("Should return all rooms", () => {
       request(mainUrl.concat('/login/?user=test&roomID=1'));
       request(mainUrl.concat('/login/?user=test&roomID=2'));
       request(mainUrl.concat('/login/?user=test&roomID=3'));

       request(mainUrl.concat('/getRooms'), {method: "GET"}, (error, response, body) => {
            expect(body).to.include.keys(["0", "1", "2", "3"]);
       });
   });
});


describe("WebSocket Server", () => {
    const mainUrl = 'http://localhost:8080';
    it("Should receive message from other users in the same room", () => {
        request(mainUrl.concat('/login/?user=test&roomID=1'), {method: "GET"}, (error, response, token1) =>{
            request(mainUrl.concat('/login/?user=test&roomID=1'), {method: "GET"}, (error, response, token2) =>{
                request(mainUrl.concat('/login/?user=test&roomID=2'), {method: "GET"}, (error, response, token3) =>{
                    const ws1 =  new WebSocket("ws://localhost:8080/?token=".concat(token1));
                    const ws2 =  new WebSocket("ws://localhost:8080/?token=".concat(token2));
                    const ws3 =  new WebSocket("ws://localhost:8080/?token=".concat(token3));

                    ws1.on('open', () => {
                        ws1.send(JSON.stringify({message: "TEST ROOM 1"}));
                    });

                    ws1.on('message', (message) =>{
                        if(debug){
                            console.log(message.toString());
                        }
                        expect(message.toString()).to.equal("TEST ROOM 1");
                    });


                    ws2.on('message', (message) => {
                        if(debug){
                            console.log(message.toString());
                        }
                        expect(message.toString()).to.equal("TEST ROOM 1");
                    });

                    ws3.on('open', () => {
                        ws3.send(JSON.stringify({message: "TEST ROOM 2"}));
                    });

                    ws3.on('message', (message) =>{
                        if(debug){
                            console.log(message.toString());
                        }
                        expect(message.toString()).to.equal("TEST ROOM 2");
                    });
                    setTimeout(() => {
                       ws1.close();
                       ws2.close();
                       ws3.close();
                    }, 25);
                });
            });
        });
    });
});