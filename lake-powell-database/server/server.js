import express from 'express';
import cors from 'cors';
import records from './records.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Mount the records router on the '/records' path
app.use('/records', records);

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});