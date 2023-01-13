import * as mongodb from 'mongodb'

export const Collections: { User?: mongodb.Collection } = {}

export async function connectToDatabase() {
    const client : mongodb.MongoClient = new mongodb.MongoClient(process.env.MONGODB_URI)

    await client.connect();

    /**
     * create database
     */
    const db : mongodb.Db = client.db(process.env.MONGODB_NAME)
    
    /**
     * create all collections
     */
    const userCollection: mongodb.Collection = db.collection(process.env.MONGODB_USER_COLLECTION);

    /**
     * setting up available for global
     */
    Collections.User = userCollection;
}