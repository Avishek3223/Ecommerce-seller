import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise;

// In production-like environments, create a new MongoClient instance directly
const client = new MongoClient(uri, options);
clientPromise = client.connect();

// Export the MongoClient promise for use in other modules
export default clientPromise;
