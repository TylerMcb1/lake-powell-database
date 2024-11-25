import express from 'express';
import cors from 'cors';
import { openConnection, closeConnection } from './connection.js';

// Import reservoir records
import powellRecords from './reservoirs/powell.js';
import meadRecords from './reservoirs/mead.js';
import mohaveRecords from './reservoirs/mohave.js';
import havasuRecords from './reservoirs/havasu.js';

// Import basin records
import upperGreenRecords from './basins/upperGreen.js';
import lowerGreenRecords from './basins/lowerGreen.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
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

// Start the Express server
(async () => {
    try {
        await openConnection();

        // Mount reservoir records on respective path
        app.use('/powell/', powellRecords);
        app.use('/mead/', meadRecords);
        app.use('/mohave/', mohaveRecords);
        app.use('/havasu/', havasuRecords);

        // Mount basin records on respective path
        app.use('/upper-green/', upperGreenRecords);
        app.use('/lower-green/', lowerGreenRecords);

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err.message);

            // Send error response to the client
            res.status(500).json({
                message: 'An error occurred on the server.',
                error: err.message
            });
        });
        
        // Start server instance
        server = app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        // Listen for keyboard interruption signal
        process.on('SIGINT', shutDown); // CTRL + C
    } catch (e) {
        console.error("Failed to connect to the database. Server not started.");
        process.exit(1);
    }
})();