import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const existing = await User.findOne({ email });
if (existing) {
  await User.updateOne({ _id: existing._id }, { $set: { role: "admin" } });
  console.log(`Promoted ${email} to admin.`);
} else {
  const user = await User.create({
    firstName: "Admin",
    lastName: "User",
    email,
    password,
    role: "admin",
    accountType: "poster",
    isVerified: true,
    status: "active",
  });
  console.log(`Created admin account for ${user.email}`);
}

await mongoose.disconnect();
console.log("Done.");
