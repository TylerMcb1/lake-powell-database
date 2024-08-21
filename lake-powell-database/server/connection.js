import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const uri = process.env.URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

if (!uri) {
    console.error("Error: Unable to retrieve environment URI variable")
}

let db = null;

try {
    await client.connect();
    console.log("Successfully connected to database")
    db = client.db("LP-WATER-DATA")
} catch(e) {
    console.error(e);
} finally {
    await client.close();
}

if (db === null) {
    console.error("Error: Unable to collect database information")
}

export default db;