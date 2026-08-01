import jwt from "jsonwebtoken";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import { sendApplicationEmail } from "../services/mailer.js";

const VALID_STATUSES = ["new", "reviewed", "approved", "rejected"];

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email || "");

// Whether the authenticated user may access a specific application.
// Admin -> always. Poster -> owns the job (id or email match). Applicant -> applied.
const canAccess = (user, app) => {
  if (user.role === "admin") return true;
  const posterIdMatch =
    app.jobPosterId && String(app.jobPosterId) === String(user._id);
  const posterEmailMatch =
    app.jobPosterEmail && app.jobPosterEmail.toLowerCase() === user.email.toLowerCase();
  const applicantMatch =
    app.applicantId && String(app.applicantId) === String(user._id);
  return posterIdMatch || posterEmailMatch || applicantMatch;
};

const sanitize = (doc) => {
  const app = doc.toObject ? doc.toObject() : { ...doc };
  if (app.cvFile) app.cvFile = { ...app.cvFile, data: undefined };
  return app;
};

// Public: submit an application (multipart/form-data with a CV file).
export const submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, coverLetter, jobId } = req.body;
    const cv = req.file;

    const errors = {};
    if (!fullName || !fullName.trim()) errors.fullName = "Full name is required";
    if (!email || !isValidEmail(email)) errors.email = "A valid email is required";
    if (!phone || !phone.trim()) errors.phone = "Phone number is required";
    if (!jobId) errors.jobId = "Job is required";
    if (!cv) errors.cv = "CV/Resume is required (PDF, DOC, or DOCX)";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Please fix the highlighted fields", errors });
    }

    const job = await Job.findById(jobId).populate("postedBy", "firstName lastName email");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.status === "closed") {
      return res.status(400).json({ message: "This job is no longer accepting applications." });
    }

    // Link the applicant to their account if a valid token was provided.
    let applicantId;
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        const candidate = await User.findById(decoded.id).select("role accountType");
        if (candidate && candidate.role !== "admin" && candidate.accountType === "seeker") {
          applicantId = candidate._id;
        }
      } catch {
        // ignore invalid tokens — applications remain public
      }
    }

    const jobPosterId = job.postedBy?._id || job.createdBy;
    const jobPosterEmail = job.employerEmail || job.contactEmail || job.postedBy?.email;

    const application = await Application.create({
      jobId: job._id,
      jobTitle: job.title,
      jobPosterId,
      jobPosterEmail,
      applicantId,
      applicantName: fullName.trim(),
      applicantEmail: email.trim().toLowerCase(),
      applicantPhone: phone.trim(),
      coverLetter: coverLetter?.trim() || "",
      cvFile: {
        filename: cv.originalname,
        contentType: cv.mimetype,
        size: cv.size,
        data: cv.buffer,
      },
    });

    let emailSent = false;
    if (jobPosterEmail) {
      const result = await sendApplicationEmail({
        to: jobPosterEmail,
        jobTitle: job.title,
        applicant: { fullName: fullName.trim(), email, phone: phone.trim() },
        coverLetter: coverLetter?.trim() || "",
        cv: { originalname: cv.originalname, buffer: cv.buffer },
      });
      emailSent = result.success;
    }

    res.status(201).json({
      message: "Your application has been submitted successfully.",
      application: sanitize(application),
      emailSent,
    });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Poster sees only their own jobs' applications; admin sees everything.
export const getApplications = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const { jobId, status, search, sort } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const and = [];

    if (!isAdmin) {
      and.push({
        $or: [
          { jobPosterId: req.user._id },
          { jobPosterEmail: req.user.email.toLowerCase() },
        ],
      });
    }

    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });
      if (!isAdmin) {
        const ownsJob =
          String(job.postedBy) === String(req.user._id) ||
          (job.createdBy && String(job.createdBy) === String(req.user._id));
        if (!ownsJob) {
          return res
            .status(403)
            .json({ message: "Access denied. You can only view applications for your own jobs." });
        }
      }
      and.push({ jobId: job._id });
    }

    if (status && VALID_STATUSES.includes(status)) {
      and.push({ status });
    }

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      and.push({ $or: [{ applicantName: regex }, { applicantEmail: regex }] });
    }

    const filter = and.length ? { $and: and } : {};
    const sortBy = sort === "oldest" ? { appliedAt: 1 } : { appliedAt: -1 };

    const [total, applications] = await Promise.all([
      Application.countDocuments(filter),
      Application.find(filter)
        .select("-cvFile.data")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({
      applications,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate(
      "jobId",
      "title company location"
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (!canAccess(req.user, app)) {
      return res
        .status(403)
        .json({ message: "Access denied. This application does not belong to you." });
    }
    res.json({ application: app });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationCV = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (!canAccess(req.user, app)) {
      return res
        .status(403)
        .json({ message: "Access denied. This application does not belong to you." });
    }

    const disposition = req.query.download === "1" ? "attachment" : "inline";
    res.setHeader("Content-Type", app.cvFile.contentType);
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${app.cvFile.filename.replace(/["\\]/g, "")}"`
    );
    res.send(app.cvFile.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (!canAccess(req.user, app)) {
      return res
        .status(403)
        .json({ message: "Access denied. This application does not belong to you." });
    }

    app.status = status;
    await app.save();

    const fresh = await Application.findById(app._id).select("-cvFile.data");
    res.json({ application: fresh, message: `Application marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addApplicationNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (!canAccess(req.user, app)) {
      return res
        .status(403)
        .json({ message: "Access denied. This application does not belong to you." });
    }

    const author = [req.user.firstName, req.user.lastName].filter(Boolean).join(" ");
    app.notes.push({ text: note.trim(), author: author || "Employer" });
    await app.save();

    const fresh = await Application.findById(app._id).select("-cvFile.data");
    res.status(201).json({ application: fresh, message: "Note added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
