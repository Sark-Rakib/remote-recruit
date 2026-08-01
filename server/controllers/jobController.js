import Job from "../models/Job.js";
import Application from "../models/Application.js";

const sanitizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 10);
};

// Only verified job posters (or admins) may create/edit job posts
const canPost = (user) => {
  if (user.role === "admin") return null;
  if (user.accountType !== "poster") {
    return "Only job poster accounts can post jobs. Please sign up as a job poster.";
  }
  if (!user.isVerified) {
    return "Please verify your email before posting jobs.";
  }
  return null;
};

// GET /api/jobs — list all active jobs (newest first)
export const getJobs = async (req, res) => {
  try {
    const { search, category, employmentType } = req.query;
    const filter = { status: "active" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (employmentType) filter.employmentType = employmentType;

    const jobs = await Job.find(filter)
      .populate("postedBy", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/:id
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "firstName lastName email role"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/mine — jobs posted by the current user, with application
// counts and dashboard stats. Restricted to job posters and admins.
export const getMyJobs = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const ownerFilter = isAdmin
      ? {}
      : { $or: [{ postedBy: req.user._id }, { createdBy: req.user._id }] };
    const jobs = await Job.find(ownerFilter).sort({ createdAt: -1 });

    const appMatch = isAdmin
      ? {}
      : {
          $or: [
            { jobPosterId: req.user._id },
            { jobPosterEmail: req.user.email.toLowerCase() },
          ],
        };

    const [counts, stats] = await Promise.all([
      Application.aggregate([
        { $match: { jobId: { $in: jobs.map((j) => j._id) } } },
        { $group: { _id: "$jobId", count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: appMatch },
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
          },
        },
      ]),
    ]);

    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    const enriched = jobs.map((job) => ({
      ...job.toObject(),
      postedBy: job.postedBy ? { _id: job.postedBy } : null,
      applicationCount: countMap.get(String(job._id)) || 0,
    }));

    res.json({
      jobs: enriched,
      stats: {
        totalJobs: jobs.length,
        totalApplications: stats[0]?.totalApplications || 0,
        activeJobs: jobs.filter((j) => j.status !== "closed").length,
        closedJobs: jobs.filter((j) => j.status === "closed").length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs — verified job poster or admin only
export const createJob = async (req, res) => {
  try {
    const blocked = canPost(req.user);
    if (blocked) {
      return res.status(403).json({ message: blocked });
    }

    const { title, company, location, salary, description, category, employmentType, tags, contactEmail } =
      req.body;

    if (!title || !company || !location || !description) {
      return res
        .status(400)
        .json({ message: "Title, company, location and description are required" });
    }

    const email = contactEmail || req.user.email;
    const job = await Job.create({
      title,
      company,
      location,
      salary: salary || "",
      description,
      category: category || "UI/UX",
      employmentType: employmentType || "Full Time",
      tags: sanitizeTags(tags),
      contactEmail: email,
      employerEmail: email,
      status: "active",
      postedBy: req.user._id,
      createdBy: req.user._id,
    });

    const populated = await job.populate("postedBy", "firstName lastName email role");
    res.status(201).json({ job: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/jobs/:id — job poster or admin only
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const isOwner = job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only edit your own job posts" });
    }

    if (!isAdmin) {
      const blocked = canPost(req.user);
      if (blocked) {
        return res.status(403).json({ message: blocked });
      }
    }

    const { title, company, location, salary, description, category, employmentType, tags, contactEmail, status } =
      req.body;

    job.title = title ?? job.title;
    job.company = company ?? job.company;
    job.location = location ?? job.location;
    job.salary = salary ?? job.salary;
    job.description = description ?? job.description;
    job.category = category ?? job.category;
    job.employmentType = employmentType ?? job.employmentType;
    if (contactEmail !== undefined) {
      job.contactEmail = contactEmail;
      job.employerEmail = contactEmail;
    }
    if (status !== undefined) {
      if (!["active", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid job status" });
      }
      job.status = status;
    }
    if (tags !== undefined) job.tags = sanitizeTags(tags);

    await job.save();
    const populated = await job.populate("postedBy", "firstName lastName email role");
    res.json({ job: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/jobs/:id — admin only
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can delete job posts." });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
