import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Job from "../models/Job.js";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected. Backfilling legacy data...");

// Users missing status -> active
const userRes = await User.updateMany(
  { status: { $exists: false } },
  { $set: { status: "active" } }
);
console.log(`Users backfilled: ${userRes.modifiedCount}`);

// Jobs missing status/employerEmail/createdBy
const jobs = await Job.find({
  $or: [{ status: { $exists: false } }, { employerEmail: { $exists: false } }],
}).populate("postedBy", "email");

let updated = 0;
for (const job of jobs) {
  const email = job.employerEmail || job.contactEmail || job.postedBy?.email || "";
  const patch = { status: "active" };
  if (email) patch.employerEmail = email;
  if (!job.createdBy) patch.createdBy = job.postedBy;
  await Job.updateOne({ _id: job._id }, { $set: patch });
  updated++;
}
console.log(`Jobs backfilled: ${updated}`);

await mongoose.disconnect();
console.log("Migration complete.");
