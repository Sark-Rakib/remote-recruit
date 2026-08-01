import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  return { page, limit, skip: (page - 1) * limit };
};

export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEmployers,
      totalApplicants,
      totalJobs,
      totalApplications,
      activeJobs,
      closedJobs,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ accountType: "poster" }),
      User.countDocuments({ accountType: "seeker" }),
      Job.countDocuments({}),
      Application.countDocuments({}),
      Job.countDocuments({ status: "active" }),
      Job.countDocuments({ status: "closed" }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalEmployers,
        totalApplicants,
        totalJobs,
        totalApplications,
        activeJobs,
        closedJobs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const { page, limit, skip } = paginate(req.query);
    const filter = {};

    if (role === "employer") filter.accountType = "poster";
    else if (role === "applicant") filter.accountType = "seeker";

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("-password -verificationToken -verificationExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const ids = users.map((u) => u._id);
    const [jobCounts, appCounts, submittedCounts] = await Promise.all([
      Job.aggregate([
        { $match: { postedBy: { $in: ids } } },
        { $group: { _id: "$postedBy", count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: { jobPosterId: { $in: ids } } },
        { $group: { _id: "$jobPosterId", count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: { applicantId: { $in: ids } } },
        { $group: { _id: "$applicantId", count: { $sum: 1 } } },
      ]),
    ]);

    const jobMap = new Map(jobCounts.map((c) => [String(c._id), c.count]));
    const appMap = new Map(appCounts.map((c) => [String(c._id), c.count]));
    const submittedMap = new Map(submittedCounts.map((c) => [String(c._id), c.count]));

    const enriched = users.map((u) => ({
      ...u.toObject(),
      jobsPosted: jobMap.get(String(u._id)) || 0,
      applicationsReceived: appMap.get(String(u._id)) || 0,
      applicationsSubmitted: submittedMap.get(String(u._id)) || 0,
    }));

    res.json({ users: enriched, total, page, pages: Math.ceil(total / limit) || 1, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid user status" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be modified." });
    }
    if (String(target._id) === String(req.user._id)) {
      return res.status(403).json({ message: "You cannot change your own status." });
    }

    target.status = status;
    await target.save();
    res.json({
      message: `User ${status === "active" ? "activated" : "suspended"} successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be deleted." });
    }
    if (String(target._id) === String(req.user._id)) {
      return res.status(403).json({ message: "You cannot delete your own account." });
    }

    const jobIds = await Job.find({ postedBy: target._id }).distinct("_id");
    await Job.deleteMany({ postedBy: target._id });
    await Application.deleteMany({
      $or: [{ jobId: { $in: jobIds } }, { jobPosterId: target._id }],
    });
    await User.findByIdAndDelete(target._id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, status } = req.query;
    const { page, limit, skip } = paginate(req.query);
    const filter = {};

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ title: regex }, { company: regex }, { employerEmail: regex }];
    }
    if (status === "active" || status === "closed") filter.status = status;

    const [total, jobs] = await Promise.all([
      Job.countDocuments(filter),
      Job.find(filter)
        .populate("postedBy", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const ids = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: ids } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

    const enriched = jobs.map((j) => ({
      ...j.toObject(),
      applicationCount: countMap.get(String(j._id)) || 0,
    }));

    res.json({ jobs: enriched, total, page, pages: Math.ceil(total / limit) || 1, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { search, status, jobId, sort } = req.query;
    const { page, limit, skip } = paginate(req.query);
    const filter = {};

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ applicantName: regex }, { applicantEmail: regex }];
    }
    if (status === "new" || status === "reviewed" || status === "approved" || status === "rejected") {
      filter.status = status;
    }
    if (jobId) filter.jobId = jobId;

    const sortBy = sort === "oldest" ? { appliedAt: 1 } : { appliedAt: -1 };

    const [total, applications] = await Promise.all([
      Application.countDocuments(filter),
      Application.find(filter)
        .select("-cvFile.data")
        .sort(sortBy)
        .skip(skip)
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
