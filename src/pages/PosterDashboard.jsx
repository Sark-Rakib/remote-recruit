import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiBriefcase,
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiArrowRight,
  HiClipboardList,
  HiSwitchHorizontal,
  HiSearch,
} from "react-icons/hi";
import { useAuth } from "../context/authContext";
import { api, getToken } from "../api/client";
import DashboardShell from "../components/dashboard/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import Badge from "../components/dashboard/Badge";
import EmptyState from "../components/dashboard/EmptyState";
import { TableSkeleton, StatSkeleton } from "../components/dashboard/Skeleton";
import ConfirmModal from "../components/dashboard/ConfirmModal";
import JobForm from "../components/JobForm";
import Toast from "../components/Toast";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function PosterDashboard() {
  const { user } = useAuth();
  const token = getToken();
  const isAdmin = user?.role === "admin";

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const data = await api.getMyJobs(token);
      setJobs(data.jobs);
      setStats(data.stats);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [fetchJobs]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await api.createJob(payload, token);
      setFormOpen(false);
      await fetchJobs();
      showToast("Job posted successfully!");
    } catch (err) {
      showToast(err.message, "error");
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
      await fetchJobs();
      showToast("Job updated successfully!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (job) => {
    const next = job.status === "closed" ? "active" : "closed";
    try {
      await api.updateJob(job._id, { status: next }, token);
      await fetchJobs();
      showToast(`Job ${next === "closed" ? "closed" : "reopened"} successfully!`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteJob(deleteTarget._id, token);
      setDeleteTarget(null);
      await fetchJobs();
      showToast("Job deleted successfully!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const navItems = [
    { icon: HiClipboardList, label: "My Jobs", active: true },
    { icon: HiSearch, label: "Find Work", to: "/jobs", active: false },
    ...(isAdmin
      ? [{ icon: HiCheckCircle, label: "Admin Panel", to: "/admin", active: false }]
      : []),
  ];

  const cards = stats
    ? [
        { icon: HiBriefcase, label: "Total Jobs Posted", value: stats.totalJobs, accent: "blue" },
        { icon: HiUsers, label: "Total Applications", value: stats.totalApplications, accent: "green" },
        { icon: HiCheckCircle, label: "Active Jobs", value: stats.activeJobs, accent: "cyan" },
        { icon: HiXCircle, label: "Closed Jobs", value: stats.closedJobs, accent: "amber" },
      ]
    : [];

  return (
    <DashboardShell navItems={navItems} pageTitle="My Jobs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] dark:text-white">
            Welcome back, {user?.firstName || "there"} 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your job posts and review applications.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <HiPlus className="w-4 h-4" />
          Post a Job
        </button>
      </div>

      {error && !loading && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20">
          {error}
        </div>
      )}

      {/* Stat cards */}
      {loading ? (
        <StatSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Jobs table */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-[#1E3A8A] dark:text-white">Job Posts</h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {loading ? "…" : `${jobs.length} job${jobs.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={HiBriefcase}
            title="You haven't posted any jobs yet"
            description="Click “Post a Job” to share your first opening with candidates worldwide."
            action={
              <button
                onClick={() => {
                  setEditingJob(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition"
              >
                <HiPlus className="w-4 h-4" />
                Post a Job
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-semibold">Job Title</th>
                  <th className="px-5 py-3 font-semibold">Posted</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Applications</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <motion.tr
                    key={job._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {job.company} · {job.location}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={job.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] dark:text-blue-400">
                        <HiUsers className="w-4 h-4 text-gray-400" />
                        {job.applicationCount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/dashboard/applications/${job._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition whitespace-nowrap"
                        >
                          <HiEye className="w-3.5 h-3.5" />
                          Applications
                        </Link>
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setFormOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          title="Edit job"
                        >
                          <HiPencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(job)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition whitespace-nowrap"
                          title={job.status === "closed" ? "Reopen job" : "Close job"}
                        >
                          <HiSwitchHorizontal className="w-3.5 h-3.5" />
                          {job.status === "closed" ? "Reopen" : "Close"}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteTarget(job)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                            title="Delete job"
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/post-job"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] dark:text-blue-400 hover:underline"
        >
          <HiArrowRight className="w-4 h-4" />
          Open full job posting page
        </Link>
      </div>

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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this job?"
        message={`“${deleteTarget?.title}” and all of its applications will be permanently deleted. This cannot be undone.`}
        confirmText="Delete Job"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </DashboardShell>
  );
}
