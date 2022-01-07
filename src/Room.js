const { MongoClient } = require("mongodb");

class Room {
    constructor() {
        const url = "mongodb://localhost:27017";
        this.client = new MongoClient(url);
        this.dbName = "ws-chat";
    }

    async addRoom(roomID) {
        if (roomID === null || roomID === undefined) {
            throw new Error("roomID can not be null");
        }
        await this.client.connect();
        const db = this.client.db(this.dbName);
        this.collection = db.collection("rooms");
        await this.collection.find({}).toArray(async (err, res) => {
            const roomsIDs = res.map((x) => x.roomID);
            if (!roomsIDs.includes(roomID)) {
                await this.collection.insertOne({ roomID: roomID });
            }
        });
    }

    async getRooms() {
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection("rooms");

        const rooms = await collection.find({}).toArray();
        const roomsIDs = rooms.map((x) => x.roomID);
        return JSON.stringify(roomsIDs);
    }
}

module.exports.Room = Room;
