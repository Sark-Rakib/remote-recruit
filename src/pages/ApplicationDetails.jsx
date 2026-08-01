import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiMail,
  HiPhone,
  HiDocumentDownload,
  HiEye,
  HiCheck,
  HiX,
  HiClock,
  HiAnnotation,
  HiPaperAirplane,
  HiDocumentText,
  HiBriefcase,
  HiClipboardList,
  HiUsers,
} from "react-icons/hi";
import { api, getToken } from "../api/client";
import DashboardShell from "../components/dashboard/DashboardShell";
import Badge from "../components/dashboard/Badge";
import EmptyState from "../components/dashboard/EmptyState";
import Toast from "../components/Toast";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const formatBytes = (bytes) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};

export default function ApplicationDetails() {
  const { jobId, applicationId } = useParams();
  const token = getToken();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchApp = async () => {
    try {
      const data = await api.getApplication(applicationId, token);
      setApp(data.application);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(null), 3500);
  };

  const setStatus = async (status) => {
    setBusy(true);
    try {
      await api.updateApplicationStatus(applicationId, status, token);
      await fetchApp();
      showToast(`Application marked as ${status}.`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      await api.addApplicationNote(applicationId, note, token);
      setNote("");
      await fetchApp();
      showToast("Note added.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingNote(false);
    }
  };

  const viewCV = async () => {
    try {
      const url = await api.fetchCV(applicationId, token, false);
      window.open(url, "_blank", "noopener");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const downloadCV = async () => {
    try {
      const url = await api.fetchCV(applicationId, token, true);
      const a = document.createElement("a");
      a.href = url;
      a.download = app?.cvFile?.filename || "cv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const navItems = [
    { icon: HiClipboardList, label: "My Jobs", to: "/dashboard", active: false },
    {
      icon: HiUsers,
      label: "Applications",
      to: `/dashboard/applications/${jobId}`,
      active: false,
    },
  ];

  const statusActions = [
    { status: "reviewed", label: "Mark as Reviewed", icon: HiClock, tone: "indigo" },
    { status: "approved", label: "Approve", icon: HiCheck, tone: "green" },
    { status: "rejected", label: "Reject", icon: HiX, tone: "red" },
  ];

  const actionTones = {
    indigo:
      "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20",
    green:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20",
    red: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20",
  };

  if (loading) {
    return (
      <DashboardShell navItems={navItems} pageTitle="Application">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !app) {
    return (
      <DashboardShell navItems={navItems} pageTitle="Application">
        <EmptyState
          icon={HiDocumentText}
          title={error || "Application not found"}
          description="You may not have permission to view this application."
          action={
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#2563EB] transition"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
          }
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={navItems} pageTitle="Application">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/dashboard/applications/${jobId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A8A] dark:text-blue-400 hover:underline mb-3"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to applications
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] dark:text-white">
                {app.applicantName}
              </h2>
              <Badge status={app.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Applied for <span className="font-semibold">{app.jobTitle}</span> ·{" "}
              {formatDate(app.appliedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusActions.map(({ status, label, icon: Icon, tone }) => (
              <button
                key={status}
                onClick={() => setStatus(status)}
                disabled={busy || app.status === status}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed ${actionTones[tone]}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
          >
            <h3 className="font-bold text-[#1E3A8A] dark:text-white mb-4">
              Applicant Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <HiMail className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Email
                  </p>
                  <a
                    href={`mailto:${app.applicantEmail}`}
                    className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-[#2563EB] dark:hover:text-blue-400 break-all"
                  >
                    {app.applicantEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <HiPhone className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <a
                    href={`tel:${app.applicantPhone}`}
                    className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-[#2563EB] dark:hover:text-blue-400"
                  >
                    {app.applicantPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <HiBriefcase className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Job
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {app.jobTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <HiClock className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Applied
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {formatDate(app.appliedAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cover letter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
          >
            <h3 className="font-bold text-[#1E3A8A] dark:text-white mb-3">
              Cover Letter
            </h3>
            {app.coverLetter ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {app.coverLetter}
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                No cover letter provided.
              </p>
            )}
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
          >
            <h3 className="font-bold text-[#1E3A8A] dark:text-white mb-4 flex items-center gap-2">
              <HiAnnotation className="w-5 h-5" />
              Notes
            </h3>

            {app.notes?.length > 0 && (
              <ul className="space-y-3 mb-5">
                {app.notes.map((n, i) => (
                  <li
                    key={i}
                    className="flex gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1E3A8A] dark:bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {n.author
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          {n.author}
                        </span>{" "}
                        · {formatDate(n.createdAt)}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                        {n.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addNote} className="flex flex-col sm:flex-row gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a private note about this candidate..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] dark:focus:border-[#2563EB] transition"
              />
              <button
                type="submit"
                disabled={savingNote || !note.trim()}
                className="inline-flex items-center justify-center gap-1.5 bg-[#1E3A8A] dark:bg-[#2563EB] hover:bg-[#2563EB] dark:hover:bg-[#1E3A8A] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiPaperAirplane className="w-4 h-4" />
                Add Note
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right column: CV */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
          >
            <h3 className="font-bold text-[#1E3A8A] dark:text-white mb-4">
              Uploaded CV
            </h3>
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 mb-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <HiDocumentText className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {app.cvFile?.filename}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {app.cvFile?.contentType} · {formatBytes(app.cvFile?.size || 0)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={viewCV}
                className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <HiEye className="w-4 h-4" />
                View CV
              </button>
              <button
                onClick={downloadCV}
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <HiDocumentDownload className="w-4 h-4" />
                Download CV
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
          >
            <h3 className="font-bold text-[#1E3A8A] dark:text-white mb-3">
              Application Status
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge status={app.status} />
              <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                {app.status}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {statusActions.map(({ status, label, icon: Icon, tone }) => (
                <button
                  key={status}
                  onClick={() => setStatus(status)}
                  disabled={busy || app.status === status}
                  className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed ${actionTones[tone]}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </DashboardShell>
  );
}
