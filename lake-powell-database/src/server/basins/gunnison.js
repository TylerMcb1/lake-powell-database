import express from 'express';
import { getDB } from '../connection.js'

const router = express.Router();

router.get('/last-14-days', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('Gunnison');

        let pipeline = [
            { $match: { Date: { $gt: new Date(new Date().setDate(new Date().getDate() - 15)) } } },
            { $group: { 
                _id: '$Date',
                'Snow Water Equivalent': { $avg: '$Snow Water Equivalent (in) Start of Day Values' },
                'Snow Depth' : { $avg: '$Snow Depth (in) Start of Day Values' },
                'Precipitation Accumulation': { $avg: '$Precipitation Accumulation (in) Start of Day Values' },
                'Precipitation Increment' : { $avg: '$Precipitation Increment (in)' },
                'Snow Water % of Median' : { $avg: '$Snow Water Equivalent % of Median (1991-2020)' },
                'Precipitation % of Median' : { $avg: '$Precipitation Accumulation % of Median (1991-2020)' },
            } },
        ];

        let results = await collection.aggregate(pipeline).sort({ '_id': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

router.get('/last-365-days', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('Gunnison');

        let pipeline = [
            { $match: { Date: { $gt: new Date(new Date().setDate(new Date().getDate() - 365)) } } },
            { $group: { 
                _id: '$Date', 
                'Snow Water Equivalent': { $avg: '$Snow Water Equivalent (in) Start of Day Values' },
                'Snow Depth' : { $avg: '$Snow Depth (in) Start of Day Values' },
                'Precipitation Accumulation': { $avg: '$Precipitation Accumulation (in) Start of Day Values' },
                'Precipitation Increment' : { $avg: '$Precipitation Increment (in)' },
                'Snow Water % of Median' : { $avg: '$Snow Water Equivalent % of Median (1991-2020)' },
                'Precipitation % of Median' : { $avg: '$Precipitation Accumulation % of Median (1991-2020)' },
            } },
        ];

        let results = await collection.aggregate(pipeline).sort({ '_id': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

router.get('/historical', async(req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            throw new Error('Both startDate and endDate must be provided');
        }

        const db = getDB();
        let collection = await db.collection('Gunnison');

        let pipeline = [
            { $match: { Date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            { $group: { 
                _id: '$Date', 
                'Snow Water Equivalent': { $avg: '$Snow Water Equivalent (in) Start of Day Values' },
                'Snow Depth' : { $avg: '$Snow Depth (in) Start of Day Values' },
                'Precipitation Accumulation': { $avg: '$Precipitation Accumulation (in) Start of Day Values' },
                'Precipitation Increment' : { $avg: '$Precipitation Increment (in)' },
                'Snow Water % of Median' : { $avg: '$Snow Water Equivalent % of Median (1991-2020)' },
                'Precipitation % of Median' : { $avg: '$Precipitation Accumulation % of Median (1991-2020)' },
            } },
        ];

        let results = await collection.aggregate(pipeline).sort({ '_id': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

export default router;