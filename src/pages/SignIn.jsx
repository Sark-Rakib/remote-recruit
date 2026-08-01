import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiExclamation } from "react-icons/hi";
import { useAuth } from "../context/authContext";

const redirectFor = (user) => {
  if (user.role === "admin") return "/admin";
  if (user.accountType === "poster") return "/dashboard";
  return "/jobs";
};

export default function SignIn() {
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendMsg("");
    setUnverifiedEmail("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(redirectFor(user));
    } catch (err) {
      if (err.code === "UNVERIFIED") {
        setUnverifiedEmail(form.email);
        setError(err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    try {
      const data = await resendVerification(unverifiedEmail);
      setResendMsg(data.message);
    } catch (err) {
      setResendMsg(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-linear-to-r from-nav-start to-nav-end rounded-xl flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-nav-start font-bold text-2xl tracking-tight">
              RemoteRecruit
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {unverifiedEmail ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiExclamation className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Email not verified yet
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {error} We sent a verification link to{" "}
                <span className="font-medium text-gray-700">
                  {unverifiedEmail}
                </span>
                . Check your inbox to activate your account.
              </p>

              {resendMsg && (
                <p className="text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2.5 mb-5">
                  {resendMsg}
                </p>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full border-2 border-nav-start text-nav-start font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <HiMail className="w-5 h-5" />
                  {resending ? "Sending..." : "Resend verification email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnverifiedEmail("");
                    setError("");
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Back to sign in
                </button>
                <Link
                  to="/resend-verification"
                  className="block w-full text-sm text-gray-400 hover:text-gray-600 font-medium"
                >
                  Use the resend verification page
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nav-start/20 focus:border-nav-start transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nav-start/20 focus:border-nav-start transition"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-500">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-nav-start hover:underline font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-nav-start to-nav-end text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-nav-start/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-nav-start hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
