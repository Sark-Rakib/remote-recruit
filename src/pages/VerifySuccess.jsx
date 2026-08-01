import { motion } from "framer-motion";
import { HiCheckCircle } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

// Shown after a valid verification link has been clicked.
export default function VerifySuccess() {
  const location = useLocation();
  const message =
    location.state?.message || "Your email has been verified successfully.";

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
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
            className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <HiCheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h1 className="text-[#1E3A8A] font-bold text-2xl mb-2">
            Email Verified!
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            {message} You can now sign in and start using RemoteRecruit.
          </p>
          <div className="space-y-3">
            <Link
              to="/signin"
              className="block w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-semibold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition"
            >
              Go to Sign In
            </Link>
            <Link
              to="/"
              className="block w-full text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-sm py-2"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
