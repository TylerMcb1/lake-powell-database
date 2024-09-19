import express from 'express';
import { getDB } from './connection.js'
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('LP');
        let results = await collection.find({}).toArray();
        res.send(JSON.stringify(results)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: e.message });
    }
});

router.get('/id/:id', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('LP');
        let query = {_id: new ObjectId(req.params.id)};
        let result = await collection.findOne(query);
        res.send(JSON.stringify(result)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: e.message });
    }
});

router.get('/last-14-days', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('LP');

        let query = {
            'Date': {
                $gt: new Date(new Date().setDate(new Date().getDate() - 15)),
            }
        };

        let results = await collection.find(query).sort({ 'Date': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: e.message });
    }
});

router.get('/last-365-days', async(req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('LP');

        let query = {
            'Date': {
                $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            },
        };
        let results = await collection.find(query).sort({ 'Date': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: e.message });
    }
});

router.post('/new-reading' , async(req, res, next) => {
    try {
        const db = getDB()
        let collection = await db.collection('LP');
        
        // Convert Date strings to Date objects
        if (req.body.Date && typeof req.body.Date === 'string') {
            const parsedDate = new Date(new Date(req.body.Date).setUTCHours(0));
            if (!isNaN(parsedDate.getTime())) {
                req.body.Date = parsedDate;
            } else { // Handle invalid date format
                res.status(400).send({ message: 'Invalid date format' });
                return next(new Error('Error posting record: Invalid date format'));
            }
        }

        const result = await collection.insertOne(req.body);
        console.log('Insert Result:', result);
        res.send({ message: 'Data received successfully', data: req.body }).status(200);
    } catch (error) {
        next(error);
    }
});

export default router;