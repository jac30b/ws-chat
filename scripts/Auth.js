const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const {format} = require('date-fns');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'ws-chat';


function Auth() {}

Auth.generateToken = async (user, roomID) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('rooms');

  const token =  jwt.sign({ user: user, roomID: roomID }, 'jeeezzz', { expiresIn: '1h' });


  const rooms = await collection.find({}).toArray(async (err, res) => {
    const roomsIDs = res.map((x) => x.roomID);
    if(!roomsIDs.includes(roomID)){
      await collection.insertOne({roomID: roomID});
    }
  });

  return token;

}

module.exports.Auth = Auth;