import app from "../server/app.js";
import connectDB from "../server/config/db.js";

// Vercel serverless entry point. Express is wired up in server/app.js; this
// just makes sure the DB is connected (cached in config/db.js) and hands the
// request to the app. Vercel preserves the original request path, so the
// /api/* routes in server/app.js match as expected.
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
