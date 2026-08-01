import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  HiChartBar,
  HiUsers,
  HiBriefcase,
  HiUserGroup,
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiSearch,
  HiTrash,
  HiEye,
  HiDocumentDownload,
  HiCheck,
  HiX,
  HiShieldCheck,
  HiFolderOpen,
} from "react-icons/hi";
import { useAuth } from "../context/authContext";
import { api, getToken } from "../api/client";
import DashboardShell from "../components/dashboard/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import Badge from "../components/dashboard/Badge";
import EmptyState from "../components/dashboard/EmptyState";
import { TableSkeleton, StatSkeleton } from "../components/dashboard/Skeleton";
import Pagination from "../components/dashboard/Pagination";
import ConfirmModal from "../components/dashboard/ConfirmModal";
import Toast from "../components/Toast";
import useDebouncedValue from "../hooks/useDebouncedValue";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function useAdminResource(fetcher, pageSize = 10) {
  const [state, setState] = useState({
    rows: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: true,
    error: "",
  });
  const [filters, setFilters] = useState({ search: "", extra: "", page: 1 });
  const search = useDebouncedValue(filters.search, 350);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const res = await fetcher({
        search: search.trim() || undefined,
        extra: filters.extra || undefined,
        page: filters.page,
        limit: pageSize,
      });
      setState({
        rows: res.rows,
        total: res.total,
        page: res.page,
        pages: res.pages,
        loading: false,
        error: "",
      });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, [fetcher, search, filters.extra, filters.page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    (patch) =>
      setFilters((f) => ({ ...f, ...patch, ...(patch.page ? {} : { page: 1 }) })),
    []
  );

  return { ...state, filters, update, refetch: load };
}

const actionBtn =
  "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition whitespace-nowrap";

export default function AdminDashboard() {
  const { user } = useAuth();
  const token = getToken();
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.adminStats(token);
      setStats(data.stats);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(null), 3500);
  };

  const runConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await confirm.action();
      showToast(confirm.successMessage || "Done!");
      if (confirm.refreshStats) await fetchStats();
      if (confirm.refresh) await confirm.refresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: HiChartBar },
    { key: "employers", label: "Employers", icon: HiBriefcase },
    { key: "jobs", label: "Jobs", icon: HiFolderOpen },
    { key: "applications", label: "Applications", icon: HiDocumentText },
  ];

  const navItems = [
    { icon: HiShieldCheck, label: "Admin Dashboard", active: true },
    { icon: HiBriefcase, label: "My Jobs", to: "/dashboard", active: false },
  ];

  return (
    <DashboardShell navItems={navItems} pageTitle="Admin Dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] dark:text-white">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Full platform overview and management.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20">
          <HiShieldCheck className="w-3.5 h-3.5" />
          {user?.firstName} · Administrator
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              tab === t.key
                ? "bg-[#1E3A8A] dark:bg-[#2563EB] text-white shadow-sm"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <OverviewTab stats={stats} loading={statsLoading} />
      )}
      {tab === "employers" && (
        <EmployersTab token={token} confirm={setConfirm} showToast={showToast} />
      )}
      {tab === "jobs" && (
        <JobsTab token={token} confirm={setConfirm} />
      )}
      {tab === "applications" && (
        <ApplicationsTab token={token} confirm={setConfirm} showToast={showToast} />
      )}

      <ConfirmModal
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmText={confirm?.confirmText}
        loading={busy}
        onConfirm={runConfirm}
        onClose={() => !busy && setConfirm(null)}
      />

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </DashboardShell>
  );
}

function OverviewTab({ stats, loading }) {
  const cards = stats
    ? [
        { icon: HiUsers, label: "Total Users", value: stats.totalUsers, accent: "blue" },
        { icon: HiBriefcase, label: "Total Employers", value: stats.totalEmployers, accent: "green" },
        { icon: HiUserGroup, label: "Total Applicants", value: stats.totalApplicants, accent: "purple" },
        { icon: HiDocumentText, label: "Total Jobs", value: stats.totalJobs, accent: "indigo" },
        { icon: HiFolderOpen, label: "Total Applications", value: stats.totalApplications, accent: "amber" },
        { icon: HiCheckCircle, label: "Active Jobs", value: stats.activeJobs, accent: "cyan" },
        { icon: HiXCircle, label: "Closed Jobs", value: stats.closedJobs, accent: "red" },
      ]
    : [];

  return loading ? (
    <StatSkeleton count={4} />
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function EmployersTab({ token, confirm, showToast }) {
  const fetcher = useCallback(
    async (p) => {
      const res = await api.adminUsers(
        { search: p.search, role: p.extra, page: p.page, limit: p.limit },
        token
      );
      return { rows: res.users, total: res.total, page: res.page, pages: res.pages };
    },
    [token]
  );
  const { rows, total, page, pages, loading, error, filters, update, refetch } =
    useAdminResource(fetcher, 10);

  const toggleStatus = async (u) => {
    const next = u.status === "suspended" ? "active" : "suspended";
    try {
      await api.adminUpdateUserStatus(u._id, next, token);
      await refetch();
      showToast(`User ${next === "active" ? "activated" : "suspended"}.`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const deleteUser = (u) => {
    confirm({
      title: "Delete this user?",
      message: `${u.firstName} ${u.lastName} (${u.email}) and all of their jobs and applications will be permanently deleted.`,
      confirmText: "Delete User",
      action: async () => api.adminDeleteUser(u._id, token),
      successMessage: "User deleted successfully.",
      refresh: refetch,
      refreshStats: true,
    });
  };

  const roleLabel = (u) => {
    if (u.role === "admin") return "Admin";
    return u.accountType === "poster" ? "Employer" : "Applicant";
  };

  return (
    <div>
      <Toolbar
        search={filters.search}
        onSearch={(v) => update({ search: v })}
        extraValue={filters.extra}
        onExtra={(v) => update({ extra: v })}
        extraOptions={[
          { value: "", label: "All roles" },
          { value: "employer", label: "Employers" },
          { value: "applicant", label: "Applicants" },
        ]}
        count={total}
      />

      {error && <ErrorBanner message={error} />}

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={7} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={HiUsers}
            title="No users found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[820px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Jobs</th>
                  <th className="px-5 py-3 font-semibold">Applications</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {roleLabel(u)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={u.status} />
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {u.jobsPosted}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {u.applicationsReceived}
                    </td>
                    <td className="px-5 py-4">
                      {u.role !== "admin" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleStatus(u)}
                            className={`${actionBtn} ${
                              u.status === "suspended"
                                ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20"
                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                            }`}
                          >
                            {u.status === "suspended" ? (
                              <>
                                <HiCheck className="w-3.5 h-3.5" /> Activate
                              </>
                            ) : (
                              <>
                                <HiX className="w-3.5 h-3.5" /> Suspend
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(u)}
                            className={`${actionBtn} bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20`}
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} pages={pages} onPageChange={(p) => update({ page: p })} />
    </div>
  );
}

function JobsTab({ token, confirm }) {
  const fetcher = useCallback(
    async (p) => {
      const res = await api.adminJobs(
        { search: p.search, status: p.extra, page: p.page, limit: p.limit },
        token
      );
      return { rows: res.jobs, total: res.total, page: res.page, pages: res.pages };
    },
    [token]
  );
  const { rows, total, page, pages, loading, error, filters, update, refetch } =
    useAdminResource(fetcher, 10);

  const deleteJob = (j) => {
    confirm({
      title: "Delete this job?",
      message: `“${j.title}” and all of its applications will be permanently deleted.`,
      confirmText: "Delete Job",
      action: async () => api.adminDeleteJob(j._id, token),
      successMessage: "Job deleted successfully.",
      refresh: refetch,
      refreshStats: true,
    });
  };

  return (
    <div>
      <Toolbar
        search={filters.search}
        onSearch={(v) => update({ search: v })}
        extraValue={filters.extra}
        onExtra={(v) => update({ extra: v })}
        extraOptions={[
          { value: "", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
        ]}
        count={total}
      />

      {error && <ErrorBanner message={error} />}

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={7} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={HiFolderOpen}
            title="No jobs found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-semibold">Job Title</th>
                  <th className="px-5 py-3 font-semibold">Employer</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Applications</th>
                  <th className="px-5 py-3 font-semibold">Posted</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr
                    key={j._id}
                    className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {j.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{j.company}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {j.postedBy?.firstName
                        ? `${j.postedBy.firstName} ${j.postedBy.lastName}`
                        : j.employerEmail || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={j.status} />
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {j.applicationCount}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(j.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/jobs/${j._id}`}
                          className={`${actionBtn} bg-blue-50 dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20`}
                        >
                          <HiEye className="w-3.5 h-3.5" />
                          View
                        </Link>
                        <button
                          onClick={() => deleteJob(j)}
                          className={`${actionBtn} bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20`}
                        >
                          <HiTrash className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} pages={pages} onPageChange={(p) => update({ page: p })} />
    </div>
  );
}

function ApplicationsTab({ token, confirm, showToast }) {
  const fetcher = useCallback(
    async (p) => {
      const res = await api.adminApplications(
        { search: p.search, status: p.extra, page: p.page, limit: p.limit },
        token
      );
      return { rows: res.applications, total: res.total, page: res.page, pages: res.pages };
    },
    [token]
  );
  const { rows, total, page, pages, loading, error, filters, update, refetch } =
    useAdminResource(fetcher, 10);

  const deleteApp = (a) => {
    confirm({
      title: "Delete this application?",
      message: `${a.applicantName}'s application for ${a.jobTitle} and its CV will be permanently deleted.`,
      confirmText: "Delete Application",
      action: async () => api.adminDeleteApplication(a._id, token),
      successMessage: "Application deleted successfully.",
      refresh: refetch,
      refreshStats: true,
    });
  };

  const downloadCV = async (a) => {
    try {
      const url = await api.fetchCV(a._id, token, true);
      const el = document.createElement("a");
      el.href = url;
      el.download = a.cvFile?.filename || "cv";
      document.body.appendChild(el);
      el.click();
      el.remove();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <Toolbar
        search={filters.search}
        onSearch={(v) => update({ search: v })}
        extraValue={filters.extra}
        onExtra={(v) => update({ extra: v })}
        extraOptions={[
          { value: "", label: "All statuses" },
          { value: "new", label: "New" },
          { value: "reviewed", label: "Reviewed" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ]}
        count={total}
      />

      {error && <ErrorBanner message={error} />}

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={7} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={HiDocumentText}
            title="No applications found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Job</th>
                  <th className="px-5 py-3 font-semibold">Employer</th>
                  <th className="px-5 py-3 font-semibold">Applied</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {a.applicantName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{a.applicantEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {a.jobTitle}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {a.jobPosterEmail || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(a.appliedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={a.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/dashboard/applications/${a.jobId}/${a._id}`}
                          className={`${actionBtn} bg-blue-50 dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20`}
                        >
                          <HiEye className="w-3.5 h-3.5" />
                          View
                        </Link>
                        <button
                          onClick={() => downloadCV(a)}
                          className={`${actionBtn} bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          <HiDocumentDownload className="w-3.5 h-3.5" />
                          CV
                        </button>
                        <button
                          onClick={() => deleteApp(a)}
                          className={`${actionBtn} bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20`}
                        >
                          <HiTrash className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} pages={pages} onPageChange={(p) => update({ page: p })} />
    </div>
  );
}

function Toolbar({ search, onSearch, extraValue, onExtra, extraOptions, count }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
      <div className="relative flex-1 sm:flex-none">
        <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
          className="w-full sm:w-60 pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] dark:focus:border-[#2563EB] transition"
        />
      </div>
      <select
        value={extraValue}
        onChange={(e) => onExtra(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 transition"
        aria-label="Filter"
      >
        {extraOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="flex-1" />
      <span className="text-xs text-gray-400 dark:text-gray-500">{count} result{count === 1 ? "" : "s"}</span>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20">
      {message}
    </div>
  );
}
