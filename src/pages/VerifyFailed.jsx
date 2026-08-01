import { useState } from "react";
import { motion } from "framer-motion";
import { HiXCircle, HiMail } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api/client";

// Shown when a verification link is invalid or expired. Lets the user resend
// the verification email (email is pre-filled when we could identify the owner
// of the expired token).
export default function VerifyFailed() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [message] = useState(location.state?.message || "");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendMsg("");
    setResending(true);
    try {
      const data = await api.resendVerification(email);
      setResendMsg(data.message);
      setSent(true);
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
        </div>

        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiXCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-[#1E3A8A] font-bold text-2xl mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {message || "This verification link is invalid or has expired."}
          </p>

          {!sent ? (
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition"
              />
              <button
                type="submit"
                disabled={resending || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-semibold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <HiMail className="w-5 h-5" />
                {resending ? "Sending..." : "Resend Verification Email"}
              </button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-2">
              <p className="text-sm text-green-700 font-medium">{resendMsg}</p>
            </div>
          )}

          {resendMsg && !sent && (
            <p className="text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2.5 mt-3">
              {resendMsg}
            </p>
          )}

          <div className="mt-6 space-y-3">
            {sent && (
              <Link
                to="/signin"
                className="block w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-semibold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition"
              >
                Go to Sign In
              </Link>
            )}
            <Link
              to="/resend-verification"
              className="block w-full text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-sm py-2"
            >
              Resend verification email
            </Link>
            <Link
              to="/"
              className="block w-full text-gray-400 hover:text-gray-600 font-semibold text-sm py-2"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
