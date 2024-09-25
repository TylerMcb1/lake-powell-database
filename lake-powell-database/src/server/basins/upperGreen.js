import express from 'express';
import { getDB } from '../connection.js'

const router = express.Router();

router.get('/last-14-days', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('UpperGreenBasin');

        let query = {
            'Date': {
                $gt: new Date(new Date().setDate(new Date().getDate() - 15)),
            }
        };

        let results = await collection.find(query).sort({ 'Date': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

router.get('/last-365-days', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('UpperGreenBasin');

        let query = {
            'Date': {
                $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            },
        };
        let results = await collection.find(query).sort({ 'Date': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

export default router;