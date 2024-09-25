import express from 'express';
import axios from 'axios';
import { getDB } from './connection.js'
import { ObjectId } from 'mongodb';

const router = express.Router();

const FETCHINTERVAL = 60000;
const APITIMEOUT = 5000;

// Weather endpoint variables
let cachedWeather = null;
let lastFetchedWeather = 0;

// Sunrise and sunset endpoint variables
let cachedSunriseSunset = null;
let lastFetchedSS = 0;

// Alerts variables
let cachedAlerts = null;
let lastFetchedAlerts = 0;

router.get('/', async (req, res) => {
    try {
        const db = getDB();
        let collection = await db.collection('LP');
        let results = await collection.find({}).toArray();
        res.send(JSON.stringify(results)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
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
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
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
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
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
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

router.get('/historical', async(req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            throw new Error('Both startDate and endDate must be provided');
        }

        const db = getDB();
        let collection = await db.collection('LP');

        let query = {
            'Date': {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
        };

        let results = await collection.find(query).sort({ 'Date': -1}).toArray();
        res.send(JSON.stringify(results, null, 2)).status(200);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching record: ', error: error.message });
    }
});

router.get('/weather', async(req, res) => {
    const currentTime = Date.now();
    
    // Return cached Weather data if time inteval > 1 minutes
    if (cachedWeather !== null && (currentTime - lastFetchedWeather < FETCHINTERVAL)) {
        return res.send(JSON.stringify(cachedWeather, null, 2)).status(200);
    }

    // Obtain updated weather data otherwise
    try {
        const response = await axios.get('https://api.weather.gov/gridpoints/FGZ/37,111/forecast/hourly?units=us', {
            headers: { 'User-Agent': 'ColoradoRiverData/1.0 (ColoradoRiverData@gmail.com)' },
            timeout: APITIMEOUT,
        });

        // Build current weather object and update cached timestamp
        cachedWeather = await response.data.properties.periods;
        lastFetchedWeather = currentTime;

        if (cachedWeather !== undefined) {
            res.send(JSON.stringify(cachedWeather, null, 2)).status(200);
        } else {
            throw new Error('Unable to locate weather gridpoint properties');
        }
    } catch (error) {
        // Timeout error
        if (error.code === 'ECONNABORTED') {
            return res.status(504).send({ message: 'Error: API call timed out' });
        }
        res.status(500).send({ message: 'Error fetching weather API: ', error: error.message })
    }
});

router.get('/sunrise-sunset', async(req, res) => {
    const currentTime = Date.now();

    // Return cached Sunrise and Sunset data if time inteval > 1 minutes
    if (cachedSunriseSunset !== null && (currentTime - lastFetchedSS < FETCHINTERVAL)) {
        return res.send(JSON.stringify(cachedSunriseSunset, null, 2)).status(200);
    }

    // Obtain updated sunrise sunset data otherwise
    try {
        const response = await axios.get('https://api.sunrise-sunset.org/json?lat=37&lng=-111&formatted=0', {
            headers: { 'User-Agent': 'ColoradoRiverData/1.0 (ColoradoRiverData@gmail.com)' },
            timeout: APITIMEOUT,
        });

        // Build current weather object and update cached timestamp
        cachedSunriseSunset = await response.data.results;

        if (cachedSunriseSunset !== undefined) {
            res.send(JSON.stringify(cachedSunriseSunset, null, 2)).status(200);
        } else {
            throw new Error('Unable to locate sunrise/sunset gridpoint');
        }
    } catch (error) {
        // Timeout error
        if (error.code === 'ECONNABORTED') {
            return res.status(504).send({ message: 'Error: API call timed out' });
        }
        res.status(500).send({ message: 'Error fetching sunrise/sunset API: ', error: error.message })
    }
});

router.get('/alerts', async(req, res) => {
    const currentTime = Date.now();

    // Return cached Sunrise and Sunset data if time inteval > 1 minutes
    if (cachedAlerts !== null && (currentTime - lastFetchedAlerts < FETCHINTERVAL)) {
        return res.send(JSON.stringify(cachedAlerts, null, 2)).status(200);
    }

    // Obtain updated sunrise sunset data otherwise
    try {
        const response = await axios.get('https://api.weather.gov/alerts/active?point=37,-111', {
            headers: { 'User-Agent': 'ColoradoRiverData/1.0 (ColoradoRiverData@gmail.com)' },
            timeout: APITIMEOUT,
        });

        // Build current alerts object and update cached timestamp
        cachedAlerts = await response.data.features;

        if (cachedAlerts !== undefined) {
            res.send(JSON.stringify(cachedAlerts, null, 2)).status(200);
        } else {
            throw new Error('Unable to locate alerts gridpoint properties');
        }
    } catch (error) {
        // Timeout error
        if (error.code === 'ECONNABORTED') {
            return res.status(504).send({ message: 'Error: API call timed out' });
        }
        res.status(500).send({ message: 'Error fetching alerts API: ', error: error.message })
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