import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

// Handles the link from the verification email (/verify-email/:token).
// On success it redirects to /verify-success; on failure to /verify-failed
// (which lets the user resend the email).
export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!token) {
        if (active) {
          navigate("/verify-failed", {
            replace: true,
            state: { code: "INVALID", message: "This verification link is invalid." },
          });
        }
        return;
      }
      try {
        const data = await api.verifyEmail(token);
        if (active) {
          navigate("/verify-success", {
            replace: true,
            state: { message: data.message },
          });
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          navigate("/verify-failed", {
            replace: true,
            state: { code: err.code, message: err.message, email: err.email },
          });
        }
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [token, navigate]);

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
          transition={{ duration: 0.5 }}
        >
          <HiMail className="w-12 h-12 text-[#2563EB] mx-auto mb-4 animate-pulse" />
          <h1 className="text-[#1E3A8A] font-bold text-2xl mb-2">
            Verifying your email...
          </h1>
          <p className="text-gray-500 text-sm">
            Please wait a moment while we confirm your email address.
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-4">{error}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
