import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HiLocationMarker,
  HiHome,
  HiCog,
  HiClipboardList,
  HiArrowRight,
  HiPlus,
  HiPencil,
  HiTrash,
  HiMail,
  HiBriefcase,
  HiCheckCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { api, getToken } from "../api/client";
import JobForm from "./JobForm";
import Navbar from "./Navbar";

const navItems = [
  { icon: HiClipboardList, label: "Your Jobs", active: true },
  { icon: HiHome, label: "Find Work", active: false },
  { icon: HiCog, label: "Settings", active: false },
];

export default function SignUpAdd() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = getToken();
  const isPoster = user?.accountType === "poster";
  const isAdmin = user?.role === "admin";
  const canPost = isAdmin || isPoster;
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMyJobs(token);
      setJobs(data.jobs);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const delay = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(delay);
  }, [fetchJobs]);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await api.createJob(payload, token);
      setFormOpen(false);
      fetchJobs();
      showNotice("Job posted successfully!");
    } catch (err) {
      showNotice(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload) => {
    setSubmitting(true);
    try {
      await api.updateJob(editingJob._id, payload, token);
      setFormOpen(false);
      setEditingJob(null);
      fetchJobs();
      showNotice("Job updated successfully!");
    } catch (err) {
      showNotice(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const openPostForm = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await api.deleteJob(job._id, token);
      fetchJobs();
      showNotice("Job deleted successfully!");
    } catch (err) {
      showNotice(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex pt-[70px] bg-gray-50/50">
      <Navbar />
      {/* left side bar */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-[#1E3A8A] text-white px-6 py-8 flex-shrink-0">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Remote <span className="text-blue-300">Recruit</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.label === "Find Work" ? "/jobs" : "/signupadd"}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-blue-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 text-sm text-blue-200/80">
            <div className="w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center text-white font-bold text-xs">
              {initials || "M"}
            </div>
            <span>
              {user?.firstName || "Max"}
              {isAdmin && (
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200">
                  Admin
                </span>
              )}
            </span>
          </div>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Welcome */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="text-sm text-gray-500">Welcome {user?.firstName || "Max"}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mt-1">
              Your Jobs
            </h1>
          </div>
          {canPost && (
            <button
              onClick={openPostForm}
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <HiPlus className="w-4 h-4" />
              Post a Job
            </button>
          )}
        </div>

        {/* Email verification banner */}
        {isPoster && !user?.isVerified && (
          <motion.div
            className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <HiMail className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Verify your email to start posting jobs
                </p>
                <p className="text-xs text-amber-700">
                  A verification link was logged to the server console.
                </p>
              </div>
            </div>
            {localStorage.getItem("verificationUrl") && (
              <a
                href={localStorage.getItem("verificationUrl")}
                className="inline-flex items-center justify-center gap-1.5 bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition whitespace-nowrap"
              >
                Open Verification Link
                <HiArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
        )}

        {/* Seeker info */}
        {!canPost && (
          <div className="mb-6 flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <HiBriefcase className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                Job Seeker account
              </p>
              <p className="text-xs text-gray-500">
                To post jobs you need a job poster account with a verified
                email.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 px-4 py-2 rounded-lg transition whitespace-nowrap"
            >
              Browse Jobs
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Notice toast */}
        {notice && (
          <motion.div
            className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium shadow-sm ${
              notice.type === "error"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {notice.message}
          </motion.div>
        )}

        {/* Error banner */}
        {error && !loading && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 bg-white animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <HiCheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-2">
              {canPost ? "You haven't posted any jobs yet" : "No jobs found"}
            </p>
            {canPost ? (
              <p className="text-gray-500 text-sm">
                Click "Post a Job" to share your first opening with the world.
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Browse available opportunities below.
              </p>
            )}
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.map((job, i) => {
            const isOwner = job.postedBy?._id === user?._id;
            const canEdit = isOwner || isAdmin;
            const canDelete = isAdmin;
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3) }}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug text-[#1E3A8A]">
                    {job.title}
                  </h3>
                  <span className="flex-shrink-0 text-xs font-semibold text-gray-400">
                    {job.salary}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                  <span className="text-xs text-gray-500">{job.company}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <HiLocationMarker className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">{job.location}</span>
                  </div>
                  {job.employmentType && (
                    <span className="text-xs text-gray-400">
                      {job.employmentType}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{job.category}</span>
                </div>

                {job.description && (
                  <p className="text-xs sm:text-sm leading-relaxed mb-2 text-gray-600">
                    {job.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs font-medium px-2.5 py-0.5 sm:py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => openEdit(job)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 transition"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(job)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 transition"
                    >
                      View
                      <HiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* right sidebar */}
      <aside className="hidden xl:flex flex-col w-[300px] flex-shrink-0 py-6 sm:py-8 lg:py-10 pr-4 sm:pr-6 lg:pr-8 gap-6">
        {/* Promo Card */}
        <div className="relative bg-linear-to-b from-[#E0E7FF] to-white rounded-2xl shadow-sm border border-indigo-100/50 p-6 pt-12 overflow-hidden">
          <div className="absolute top-4 right-6 w-5 h-5 rounded-full bg-yellow-400/60" />
          <div className="absolute bottom-8 left-6 w-4 h-4 rounded-full bg-blue-400/40" />

          <div className="relative z-10">
            <h3 className="text-[#1E3A8A] font-bold text-base sm:text-lg leading-snug mb-2">
              Looking for work?
              <br />
              Your next job is here!
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5">
              Browse thousands of remote opportunities — no account needed.
            </p>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Find a Job
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Job Form Modal */}
      <JobForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingJob(null);
        }}
        onSubmit={editingJob ? handleUpdate : handleCreate}
        initial={editingJob}
        submitting={submitting}
        defaultContactEmail={user?.email}
      />
    </div>
  );
}
