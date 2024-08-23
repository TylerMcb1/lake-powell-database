import express from 'express';
import { getDB } from './connection.js'
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection("LP");
        let results = await collection.find({}).toArray();
        res.send(results).status(200);
    } catch (e) {
        res.status(500).send({ message: "Error fetching record", error: e.message });
    }
});

router.get('/get/:id', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection("LP");
        let query = {_id: new ObjectId(req.params.id)};
        let result = await collection.findOne(query);
        res.send(result).status(200);
    } catch (e) {
        res.status(500).send({ message: "Error fetching record", error: e.message });
    }
});

router.get('/get', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection("LP");

        let query = {
            "Date": {
                $gte: new Date("1983-07-01T00:00:00Z"),
                $lte: new Date("1983-07-15T00:00:00Z")
            }
        };

        let results = await collection.find(query).sort({ "Date": -1}).toArray();
        res.send(results).status(200);
    } catch (e) {
        res.status(500).send({ message: "Error fetching record", error: e.message });
    }
});

export default router;