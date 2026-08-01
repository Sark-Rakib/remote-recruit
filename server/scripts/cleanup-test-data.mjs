import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

await mongoose.connect(
  process.env.MONGO_URI ||
    "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/remote_recruit?retryWrites=true&w=majority"
);

const TEST_APPLICANT_EMAILS = ["jane@app.com", "linked@seek.com"];
const TEST_EMPLOYER_EMAILS = ["hr@acorp.com", "postera@example.com", "posterb@example.com"];
const TEST_USER_EMAILS = [
  "postera@example.com",
  "posterb@example.com",
  "seeker1@example.com",
  "verifyflow@example.com",
  "hr@verifyco.com",
];
const TEST_JOB_TITLES = ["A Corp Role", "B Corp Role", "Test QA Engineer"];

const appRes = await Application.deleteMany({
  $or: [
    { applicantEmail: { $in: TEST_APPLICANT_EMAILS } },
    { jobPosterEmail: { $in: TEST_EMPLOYER_EMAILS } },
  ],
});
console.log("Deleted applications:", appRes.deletedCount);

const jobRes = await Job.deleteMany({
  $or: [
    { title: { $in: TEST_JOB_TITLES } },
    { employerEmail: { $in: TEST_EMPLOYER_EMAILS } },
  ],
});
console.log("Deleted jobs:", jobRes.deletedCount);

const userRes = await User.deleteMany({ email: { $in: TEST_USER_EMAILS } });
console.log("Deleted users:", userRes.deletedCount);

const rakib = await User.findOneAndUpdate(
  { email: "mdrakibsarkar75@gmail.com" },
  { $set: { accountType: "poster", isVerified: true, status: "active" } },
  { new: true }
);
console.log(
  "Rakib updated:",
  rakib
    ? `${rakib.firstName} ${rakib.lastName} | type=${rakib.accountType} | verified=${rakib.isVerified}`
    : "NOT FOUND"
);

await mongoose.disconnect();
