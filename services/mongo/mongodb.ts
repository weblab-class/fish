// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_SECRET;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export async function mongodbConnect() {
  if (process.env.NODE_ENV === "development") {
    // @ts-ignore
    if (!global._mongoClientPromise) {
      // @ts-ignore
      client = new MongoClient(uri);
      // @ts-ignore
      global._mongoClientPromise = client.connect();
    }
    // @ts-ignore
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}