import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
      index: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    jobPosterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    jobPosterEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    applicantName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    applicantPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },
    cvFile: {
      filename: { type: String, required: true },
      contentType: { type: String, required: true },
      size: { type: Number, required: true },
      data: { type: Buffer, required: true },
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "approved", "rejected"],
      default: "new",
      index: true,
    },
    notes: [
      {
        text: { type: String, trim: true },
        author: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
