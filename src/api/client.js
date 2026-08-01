const API_URL = "/api";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};
export const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const removeUser = () => localStorage.removeItem("user");

const qs = (params = {}) => {
  const search = new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  ).toString();
  return search ? `?${search}` : "";
};

const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const request = async (path, { method = "GET", body, token } = {}) => {
  const headers = { "Content-Type": "application/json", ...authHeaders(token) };
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return data;
};

export const api = {
  // ── Auth ──────────────────────────────────────────────
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),
  verifyEmail: (token) => request(`/auth/verify-email/${token}`),
  resendVerification: (email) =>
    request("/auth/resend-verification", { method: "POST", body: { email } }),

  // ── Jobs ──────────────────────────────────────────────
  getJobs: (params = {}) => request(`/jobs${qs(params)}`),
  getJob: (id) => request(`/jobs/${id}`),
  getMyJobs: (token) => request("/jobs/mine", { token }),
  createJob: (payload, token) =>
    request("/jobs", { method: "POST", body: payload, token }),
  updateJob: (id, payload, token) =>
    request(`/jobs/${id}`, { method: "PUT", body: payload, token }),
  deleteJob: (id, token) => request(`/jobs/${id}`, { method: "DELETE", token }),

  // ── Applications ──────────────────────────────────────
  applyForJob: async (formData, token) => {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit application");
    }
    return data;
  },
  getApplications: (params = {}, token) =>
    request(`/applications${qs(params)}`, { token }),
  getApplication: (id, token) => request(`/applications/${id}`, { token }),
  updateApplicationStatus: (id, status, token) =>
    request(`/applications/${id}/status`, { method: "PUT", body: { status }, token }),
  addApplicationNote: (id, note, token) =>
    request(`/applications/${id}/notes`, { method: "POST", body: { note }, token }),
  deleteApplication: (id, token) =>
    request(`/applications/${id}`, { method: "DELETE", token }),
  fetchCV: async (id, token, download = false) => {
    const res = await fetch(
      `${API_URL}/applications/${id}/cv${download ? "?download=1" : ""}`,
      { headers: authHeaders(token) }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to fetch CV");
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },

  // ── Admin ─────────────────────────────────────────────
  adminStats: (token) => request("/admin/stats", { token }),
  adminUsers: (params = {}, token) =>
    request(`/admin/users${qs(params)}`, { token }),
  adminUpdateUserStatus: (id, status, token) =>
    request(`/admin/users/${id}/status`, { method: "PATCH", body: { status }, token }),
  adminDeleteUser: (id, token) =>
    request(`/admin/users/${id}`, { method: "DELETE", token }),
  adminJobs: (params = {}, token) =>
    request(`/admin/jobs${qs(params)}`, { token }),
  adminDeleteJob: (id, token) =>
    request(`/admin/jobs/${id}`, { method: "DELETE", token }),
  adminApplications: (params = {}, token) =>
    request(`/admin/applications${qs(params)}`, { token }),
  adminDeleteApplication: (id, token) =>
    request(`/admin/applications/${id}`, { method: "DELETE", token }),
};
