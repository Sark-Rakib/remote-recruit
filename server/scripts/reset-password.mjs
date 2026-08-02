import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const EMAIL = "mdrakibsarkar1@gmail.com";
const NEW_PASSWORD = process.argv[2] || "poster123456";

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOne({ email: EMAIL });
if (!user) {
  console.log("NOT FOUND");
  process.exit(1);
}
user.password = NEW_PASSWORD;
await user.save();
console.log(
  `Password reset for ${user.email} | verified=${user.isVerified} | type=${user.accountType}`
);

await mongoose.disconnect();
