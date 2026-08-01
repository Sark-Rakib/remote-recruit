import app from "./app.js";
import connectDB from "./config/db.js";
import { verifyEmailService } from "./services/mailer.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await verifyEmailService();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();
