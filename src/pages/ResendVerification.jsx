import { useState } from "react";
import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { api } from "../api/client";

// Standalone page to re-request the verification email for a registered but
// unverified account.
export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await api.resendVerification(email);
      setMessage(data.message);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Resend verification email</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter the email you registered with and we'll send a new link.
          </p>
        </div>

        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nav-start/20 focus:border-nav-start transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-nav-start to-nav-end text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-nav-start/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
              >
                <HiMail className="w-5 h-5" />
                {loading ? "Sending..." : "Send new verification email"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiMail className="w-8 h-8 text-nav-start" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="block w-full border-2 border-nav-start text-nav-start font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  Send to a different email
                </button>
                <Link
                  to="/signin"
                  className="block w-full bg-linear-to-r from-nav-start to-nav-end text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-nav-start/25 transition-all duration-200 hover:scale-[1.02] text-center"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered it?{" "}
            <Link to="/signin" className="text-nav-start hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
