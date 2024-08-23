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

router.get('/:id', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection("LP");
        let query = {_id: new ObjectId(req.params.id)};
        let result = await collection.findOne(query);

        if(!result) res.send('Unable to locate record').status(404);
        else res.send(result).status(200);
    } catch (e) {
        res.status(500).send({ message: "Error fetching record", error: e.message });
    }
});

export default router;