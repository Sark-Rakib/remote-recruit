import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/remote_recruit?retryWrites=true&w=majority";

// Kept across invocations so warm Vercel serverless instances reuse the
// existing connection instead of opening a new one each request.
let connectionPromise = null;

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);

// Returns a live connection, reconnecting when the previous one went stale.
// Serverless instances get frozen between requests and MongoDB Atlas may close
// idle sockets, so we verify with a cheap ping before trusting readyState —
// otherwise queries would silently buffer and time out.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      await withTimeout(mongoose.connection.db.admin().command({ ping: 1 }), 5000, "Mongo ping");
      return mongoose.connection;
    } catch {
      // stale connection — fall through and reconnect
      connectionPromise = null;
    }
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        // Fail fast with a real error instead of buffering queries for 10s.
        bufferCommands: false,
      })
      .then(() => mongoose.connection)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
