import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

let db = null;
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

export async function openConnection() {
    try {
        await client.connect();
        console.log("Successfully connected to database");
    } catch(e) {
        console.error("Error connecting to database: ", e);
        throw e;
    }
}

export function getDB() {
    if (!db) {
        db = client.db("LP-WATER-DATA");
    }
    return db;
}

export async function closeConnection() {
    try {
        await client.disconnect();
    } catch (e) {
        console.error("Error disconnecting from database: ", e)
    }
}