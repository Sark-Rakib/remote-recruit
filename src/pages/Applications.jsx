import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiDocumentDownload,
  HiEye,
  HiCheck,
  HiX,
  HiClock,
  HiUsers,
  HiSearch,
  HiClipboardList,
} from "react-icons/hi";
import { api, getToken } from "../api/client";
import DashboardShell from "../components/dashboard/DashboardShell";
import Badge from "../components/dashboard/Badge";
import EmptyState from "../components/dashboard/EmptyState";
import { TableSkeleton } from "../components/dashboard/Skeleton";
import Pagination from "../components/dashboard/Pagination";
import Toast from "../components/Toast";
import useApplications from "../hooks/useApplications";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function Applications() {
  const { jobId } = useParams();
  const token = getToken();
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const {
    applications,
    total,
    page,
    pages,
    loading,
    error,
    filters,
    update,
    refetch,
  } = useApplications({ jobId, token });

  useEffect(() => {
    let active = true;
    api
      .getJob(jobId)
      .then((data) => {
        if (active) setJob(data.job);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setJobLoading(false);
      });
    return () => {
      active = false;
    };
  }, [jobId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(null), 3500);
  };

  const setStatus = async (application, status) => {
    try {
      await api.updateApplicationStatus(application._id, status, token);
      await refetch();
      showToast(`Application marked as ${status}.`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const downloadCV = async (application) => {
    try {
      const url = await api.fetchCV(application._id, token, true);
      const a = document.createElement("a");
      a.href = url;
      a.download = application.cvFile?.filename || "cv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const navItems = [
    { icon: HiClipboardList, label: "My Jobs", to: "/dashboard", active: false },
    { icon: HiUsers, label: "Applications", active: true },
  ];

  return (
    <DashboardShell navItems={navItems} pageTitle="Applications">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A8A] dark:text-blue-400 hover:underline mb-3"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] dark:text-white">
              {jobLoading ? "Loading job..." : job?.title || "Job applications"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {loading ? "…" : `${total} application${total === 1 ? "" : "s"}`}
              {job && !jobLoading && ` · ${job.company}`}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => update({ status: f.value })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filters.status === f.value
                  ? "bg-[#1E3A8A] dark:bg-[#2563EB] text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="Search name or email"
              className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] dark:focus:border-[#2563EB] transition"
            />
          </div>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 transition"
            aria-label="Sort applications"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={HiUsers}
            title="No applications found"
            description={
              filters.status || filters.search
                ? "Try clearing your filters or search to see more applications."
                : "Applications submitted by candidates will appear here."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Applied</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/applications/${jobId}/${app._id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {app.applicantName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition">
                          {app.applicantName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {app.applicantEmail}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {app.applicantPhone}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <HiClock className="w-4 h-4 text-gray-400" />
                        {formatDate(app.appliedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <Link
                          to={`/dashboard/applications/${jobId}/${app._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition"
                        >
                          <HiEye className="w-3.5 h-3.5" />
                          Details
                        </Link>
                        <button
                          onClick={() => downloadCV(app)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          <HiDocumentDownload className="w-3.5 h-3.5" />
                          CV
                        </button>
                        {app.status === "new" && (
                          <button
                            onClick={() => setStatus(app, "reviewed")}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition"
                          >
                            <HiClock className="w-3.5 h-3.5" />
                            Review
                          </button>
                        )}
                        <button
                          onClick={() => setStatus(app, "approved")}
                          disabled={app.status === "approved"}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <HiCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(app, "rejected")}
                          disabled={app.status === "rejected"}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <HiX className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} pages={pages} onPageChange={(p) => update({ page: p })} />

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </DashboardShell>
  );
}
