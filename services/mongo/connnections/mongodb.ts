// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_SECRET;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * MongoDB client.
 *
 * **NOTE: Use `mongooseConnect()` for all database-related operations. This is only meant for authentication with `next-auth`.**
 * @returns A promise that resolves to a cached MongoDB connection.
 */
export async function mongodbConnect() {
  if (process.env.NODE_ENV === "development") {
    // needed because of re-renders
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}
