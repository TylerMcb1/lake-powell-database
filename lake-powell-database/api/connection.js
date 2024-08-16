import 'dotenv/config';
import { MongoClient } from "mongodb";

async function main() {
    /**
     * Connection URI function
     */
    const user = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;

    const uri = `mongodb+srv://${user}:${password}@lp-cluster-1.nkylnuc.mongodb.net/?retryWrites=true&w=majority&appName=LP-Cluster-1`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("success!");
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.dir);