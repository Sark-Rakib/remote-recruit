import app from "../server/app.js";
import connectDB from "../server/config/db.js";

// Vercel serverless entry point. Express is wired up in server/app.js; this
// just makes sure the DB is connected (cached in config/db.js) and hands the
// request to the app. Vercel preserves the original request path, so the
// /api/* routes in server/app.js match as expected.
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    // Surface the real failure instead of letting Vercel return the generic
    // FUNCTION_INVOCATION_FAILED page, so deployment issues are easy to read.
    console.error("Serverless handler error:", error);
    res.status(500).json({
      message: "Serverless function failed",
      error: error.message,
      name: error.name,
      env: {
        mongoUriSet: Boolean(process.env.MONGO_URI),
        mongoUriHost: (process.env.MONGO_URI || "")
          .replace(/^mongodb\+srv:\/\/[^@]*@/, "mongodb+srv://***@")
          .split("?")[0],
        frontendUrl: process.env.FRONTEND_URL,
      },
    });
  }
}
