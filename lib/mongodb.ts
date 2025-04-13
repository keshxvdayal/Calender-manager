import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGOURL ||
  "mongodb+srv://admin:admin12345@cluster0.ysbxxif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const MONGODB_DB = "calendar_app"

// Check if we have a connection to the database or if it's time to create a new one
let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we have a connection to the database, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // If no connection, create one
  const client = await MongoClient.connect(MONGODB_URI)

  // Select the database
  const db = client.db(MONGODB_DB)

  // Cache the client and db connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}
