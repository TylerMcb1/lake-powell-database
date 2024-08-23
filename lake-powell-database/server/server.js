import express from 'express';
import cors from 'cors';
import records from './records.js';
import { openConnection, closeConnection } from './connection.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Start the Express server
(async () => {
    try {
        await openConnection();

        // Mount the records router on the '/records' path
        app.use('/', records);

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (e) {
        console.error("Failed to connect to the database. Server not started.");
        process.exit(1);
    } finally {
        await closeConnection();
    }
})();