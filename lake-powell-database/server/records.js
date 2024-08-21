import express from 'express';
import db from './connection.js'
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
    let collection = await db.collections("records");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get('/:id', async(req, res) => {
    let collection = await db.collections("records");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result) res.send('Unable to locate record').status(404);
    else res.send(result).status(200);
});

export default router;