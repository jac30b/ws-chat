const urlParser = require('url-parse');
const qs = require('qs');
const {Auth} = require('./Auth');

// TODO: Move to seperate file
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'ws-chat';

function Router(){}

Router.route = async (url, data) => {
    const parsedUrl = new urlParser(url);
    const parsedParams = qs.parse(parsedUrl.query,  {ignoreQueryPrefix: true});
    if(parsedUrl.pathname == '/login'){
        return await Auth.generateToken(parsedParams.user, parsedParams.roomID);
    }

    if(parsedUrl.pathname == '/getRooms'){
        // TODO: Move to seperate file
        
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('rooms');
        
        const rooms = await collection.find({}).toArray();
        const roomsIDs = rooms.map((x) => x.roomID);
        return JSON.stringify(roomsIDs);
    }
}

module.exports.Router = Router;