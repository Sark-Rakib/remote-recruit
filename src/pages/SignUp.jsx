import { useState } from "react";
import { Link } from "react-router-dom";
import { HiBriefcase, HiUserGroup, HiCheck, HiMail } from "react-icons/hi";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";

const IS_DEV = !import.meta.env.PROD;

export default function SignUp() {
  const { signup, resendVerification } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [accountType, setAccountType] = useState("poster");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // form | success
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signup({ ...form, accountType });
      setRegisteredEmail(form.email);
      setVerificationUrl(data.verificationUrl || "");
      setEmailWarning(data.emailSent === false ? data.warning || "" : "");
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    setEmailWarning("");
    try {
      const data = await resendVerification(registeredEmail);
      setResendMsg(data.message);
      if (data.emailSent === false && data.warning) setEmailWarning(data.warning);
    } catch (err) {
      setResendMsg(err.message);
    } finally {
      setResending(false);
    }
  };

  const accountTypes = [
    {
      value: "poster",
      icon: HiBriefcase,
      title: "Job Poster",
      desc: "Post jobs and hire remote talent",
    },
    {
      value: "seeker",
      icon: HiUserGroup,
      title: "Job Seeker",
      desc: "Browse and apply to remote jobs",
    },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">
            {step === "form" ? "Create an account" : "Verify your email"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {step === "form"
              ? "Start hiring top remote talent today"
              : "One last step before you can sign in"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {step === "form" ? (
            <>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nav-start/20 focus:border-nav-start transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nav-start/20 focus:border-nav-start transition"
                    />
                  </div>
                </div>
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
                    minLength={6}
                    placeholder="Create a password (min. 6 characters)"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nav-start/20 focus:border-nav-start transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    I am signing up as
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {accountTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setAccountType(type.value)}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                          accountType === type.value
                            ? "border-nav-start bg-blue-50/50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        {accountType === type.value && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-nav-start flex items-center justify-center">
                            <HiCheck className="w-3 h-3 text-white" />
                          </span>
                        )}
                        <type.icon
                          className={`w-6 h-6 mb-2 ${
                            accountType === type.value
                              ? "text-nav-start"
                              : "text-gray-400"
                          }`}
                        />
                        <p className="text-sm font-semibold text-gray-900">
                          {type.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                          {type.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    All accounts must verify their email before signing in.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-nav-start to-nav-end text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-nav-start/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-nav-start hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiMail className="w-8 h-8 text-nav-start" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                A verification email has been sent
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                We sent a verification link to{" "}
                <span className="font-medium text-gray-700">
                  {registeredEmail}
                </span>
                . Please check your inbox and verify your email before logging
                in.
              </p>

              {IS_DEV && verificationUrl && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-left">
                  <p className="text-xs font-semibold text-amber-700 mb-1">
                    Testing shortcut (dev only)
                  </p>
                  <a
                    href={verificationUrl}
                    className="text-xs text-nav-start break-all hover:underline"
                  >
                    {verificationUrl}
                  </a>
                </div>
              )}

              {emailWarning && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-left">
                  <p className="text-xs font-semibold text-red-700 mb-1">
                    Email delivery failed
                  </p>
                  <p className="text-xs text-red-600 break-words">
                    {emailWarning}
                  </p>
                </div>
              )}

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
                  className="w-full border-2 border-nav-start text-nav-start font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending..." : "Resend verification email"}
                </button>
                <Link
                  to="/signin"
                  className="block w-full bg-linear-to-r from-nav-start to-nav-end text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-nav-start/25 transition-all duration-200 hover:scale-[1.02] text-center"
                >
                  Go to Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
