import express from 'express';
import cors from 'cors';
import records from './records.js';
import { openConnection, closeConnection } from './connection.js';

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

        // Mount the records router on the '/' path
        app.use('/', records);

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
        process.on('SIGINT', shutDown); // CNTL + C
    } catch (e) {
        console.error("Failed to connect to the database. Server not started.");
        process.exit(1);
    }
})();