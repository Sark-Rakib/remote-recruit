import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiDocumentDownload,
  HiPaperAirplane,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi";
import { api } from "../api/client";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTS = [".pdf", ".doc", ".docx"];

const emptyForm = { fullName: "", email: "", phone: "", coverLetter: "" };

export default function ApplyModal({ open, onClose, onError, job }) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus?.();
      previousFocus.current = null;
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, submitting]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      const ext = selected.name.slice(selected.name.lastIndexOf(".")).toLowerCase();
      const typeOk = ACCEPTED_TYPES.includes(selected.type) && ACCEPTED_EXTS.includes(ext);
      if (!typeOk) {
        setErrors({ ...errors, cv: "Only PDF, DOC, or DOCX files are allowed." });
      } else if (selected.size > MAX_FILE_SIZE) {
        setErrors({ ...errors, cv: "File is too large. Maximum size is 4MB." });
      } else {
        setErrors((prev) => ({ ...prev, cv: undefined }));
      }
    }
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "A valid email is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!file) next.cv = "Please upload your CV/Resume";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("coverLetter", form.coverLetter.trim());
      formData.append("jobId", job._id);
      formData.append("cv", file);

      await api.applyForJob(formData);
      setForm(emptyForm);
      setFile(null);
      setErrors({});
      onClose(true);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition bg-white ${
      hasError ? "border-red-300" : "border-gray-200"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-remote-blue/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={submitting ? undefined : onClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            tabIndex={-1}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto outline-none"
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 sm:px-8 pt-6 sm:pt-7 pb-4 border-b border-gray-100">
              <div>
                <h2
                  id="apply-modal-title"
                  className="text-lg sm:text-xl font-bold text-[#1E3A8A]"
                >
                  Apply for this Job
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {job?.title} · {job?.company}
                </p>
              </div>
              <button
                onClick={() => !submitting && onClose()}
                disabled={submitting}
                aria-label="Close"
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-50"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="px-6 sm:px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={fieldClass(errors.fullName)}
                  aria-invalid={!!errors.fullName}
                  disabled={submitting}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass(errors.email)}
                    aria-invalid={!!errors.email}
                    disabled={submitting}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={fieldClass(errors.phone)}
                    aria-invalid={!!errors.phone}
                    disabled={submitting}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  CV / Resume <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (PDF, DOC, DOCX — max 4MB)
                  </span>
                </label>
                <label
                  className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition text-center ${
                    errors.cv
                      ? "border-red-300 bg-red-50/40"
                      : file
                      ? "border-green-300 bg-green-50/40"
                      : "border-gray-200 hover:border-[#1E3A8A]/40 hover:bg-blue-50/30"
                  }`}
                >
                  <HiDocumentDownload className="w-6 h-6 text-[#2563EB]" />
                  {file ? (
                    <>
                      <span className="text-sm font-semibold text-gray-800 break-all">
                        {file.name}
                      </span>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <HiCheckCircle className="w-3.5 h-3.5" />
                        Ready to upload
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-600">
                        Click to upload your CV
                      </span>
                      <span className="text-xs text-gray-400">
                        PDF, DOC, or DOCX up to 4MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={submitting}
                  />
                </label>
                {errors.cv && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <HiExclamationCircle className="w-3.5 h-3.5" />
                    {errors.cv}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cover Letter{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell the employer why you're a great fit..."
                  className={`${fieldClass(false)} resize-none`}
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !submitting && onClose()}
                  disabled={submitting}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
