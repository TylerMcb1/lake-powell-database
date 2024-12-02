import express from 'express';
import cors from 'cors';
import http from 'http';
import { openConnection, closeConnection } from './connection.js';

// Import reservoir records
import powellRecords from './reservoirs/powell.js';
import meadRecords from './reservoirs/mead.js';
import mohaveRecords from './reservoirs/mohave.js';
import havasuRecords from './reservoirs/havasu.js';

// Import basin records
import upperGreenRecords from './basins/upperGreen.js';
import lowerGreenRecords from './basins/lowerGreen.js';
import whiteYampaRecords from './basins/whiteYampa.js';
import coloradoHeadwatersRecords from './basins/coloradoHeadwaters.js';
import doloresRecords from './basins/dolores.js';
import gunnisonRecords from './basins/gunnison.js';
import dirtyDevilRecords from './basins/dirtyDevil.js';
import lowerSanJuanRecords from './basins/lowerSanJuan.js';
import upperSanJuanRecords from './basins/upperSanJuan.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({
    origin: 'https://coloradoriverdata.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

let server;

const shutDown = async () => {
    console.log('\nShutting down...');
    try {
        // Close the database connection
        await closeConnection();

        // Stop the Express server from accepting new requests
        server.close(() => {
            console.log('Server closed successfully.');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}

const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).send('Authentication required');
        return;
    }

    const encoded = authHeader.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [username, password] = decoded.split(':');

    if (username === process.env.AUTH_USER && password === process.env.AUTH_PASS) {
        next();
    } else {
        res.status(401).send('Invalid credentials');
        return;
    }
};

// HTTPS Enforcing middleware
// app.use((req, res, next) => {
//     if (req.protocol === 'http') {
//         res.redirect(`https://${process.env.HOST_URL}`);
//     }
//     next();
// });

// Start the Express server
(async () => {
    try {
        await openConnection();

        // Middleware to enforce basic authentication
        app.use(basicAuth);

        // Mount reservoir records on respective path
        app.use('/powell/', powellRecords);
        app.use('/mead/', meadRecords);
        app.use('/mohave/', mohaveRecords);
        app.use('/havasu/', havasuRecords);

        // Mount basin records on respective path
        app.use('/upper-green/', upperGreenRecords);
        app.use('/lower-green/', lowerGreenRecords);
        app.use('/white-yampa/', whiteYampaRecords);
        app.use('/colorado-headwaters/', coloradoHeadwatersRecords);
        app.use('/dolores/', doloresRecords);
        app.use('/gunnison/', gunnisonRecords);
        app.use('/dirty-devil/', dirtyDevilRecords);
        app.use('/lower-san-juan/', lowerSanJuanRecords);
        app.use('/upper-san-juan/', upperSanJuanRecords);

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err.message);

            // Send error response to the client
            res.status(500).json({
                message: 'An error occurred on the server.',
                error: err.message
            });
            next();
        });

        // Create the HTTPS server with Express app
        server = app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        // Listen for keyboard interruption signal
        process.on('SIGINT', shutDown); // CTRL + C
    } catch (e) {
        console.error("Failed to connect to the database:", e);
        process.exit(1);
    }
})();