import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/remote_recruit?retryWrites=true&w=majority";

// Cached across invocations so warm Vercel serverless instances reuse the
// existing connection instead of opening a new one each request.
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return cachedConnection;
  }
  if (mongoose.connection.readyState >= 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    cachedConnection = mongoose.connection;
    console.log("✅ MongoDB connected");
    return cachedConnection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Throw instead of process.exit so serverless platforms (Vercel) can
    // surface the failure per-request rather than killing the instance.
    throw error;
  }
};

export default connectDB;
