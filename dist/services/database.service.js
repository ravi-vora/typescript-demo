import * as mongodb from 'mongodb';
export const Collections = {};
export async function connectToDatabase() {
    const client = new mongodb.MongoClient(process.env.MONGODB_URI);
    await client.connect();
    /**
     * create database
     */
    const db = client.db(process.env.MONGODB_NAME);
    /**
     * create all collections
     */
    const userCollection = db.collection(process.env.MONGODB_USER_COLLECTION);
    /**
     * setting up available for global
     */
    Collections.User = userCollection;
}
//# sourceMappingURL=database.service.js.map