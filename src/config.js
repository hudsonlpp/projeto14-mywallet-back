import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

await mongoClient.connect();
db = mongoClient.db();


export default db;