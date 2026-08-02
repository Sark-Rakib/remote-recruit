import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiLocationMarker,
  HiBriefcase,
  HiCash,
  HiClock,
  HiTag,
  HiUser,
  HiArrowLeft,
  HiMail,
} from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import Navbar from "../components/Navbar";
import ApplyModal from "../components/ApplyModal";
import Toast from "../components/Toast";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .getJob(id)
      .then((data) => {
        if (active) setJob(data.job);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(null), 4000);
  };

  const detailItem = (icon, label, value) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[#1E3A8A] font-semibold text-sm">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 pt-[70px]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A8A] hover:text-[#2563EB] transition"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to all jobs
          </Link>
        </motion.div>

        {/* Error / not found */}
        {!loading && (error || !job) && (
          <motion.div
            className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg mb-2">
              {error || "Job not found"}
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#2563EB] transition"
            >
              Browse all jobs
            </Link>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>
        )}

        {/* Job card */}
        {!loading && job && (
          <motion.div
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="bg-linear-to-r from-[#1E3A8A] to-[#2563EB] px-6 sm:px-10 py-8">
              <span className="inline-block bg-white/15 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                {job.category}
              </span>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">
                {job.title}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-3">
                {job.company}
              </p>
            </div>

            <div className="px-6 sm:px-10 py-8">
              {/* Key details */}
              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                {detailItem(
                  <HiBriefcase className="w-5 h-5 text-[#2563EB]" />,
                  "Employment Type",
                  job.employmentType || "Not specified",
                )}
                {detailItem(
                  <HiLocationMarker className="w-5 h-5 text-[#2563EB]" />,
                  "Location",
                  job.location || "Not specified",
                )}
                {detailItem(
                  <HiCash className="w-5 h-5 text-[#2563EB]" />,
                  "Salary Range",
                  job.salary || "Not disclosed",
                )}
                {detailItem(
                  <HiClock className="w-5 h-5 text-[#2563EB]" />,
                  "Posted",
                  formatDate(job.createdAt),
                )}
              </div>

              {/* Description */}
              <h2 className="text-[#1E3A8A] font-bold text-lg mb-3 flex items-center gap-2">
                <HiBriefcase className="w-5 h-5" />
                Job Description
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-8">
                {job.description}
              </p>

              {/* Tags */}
              {job.tags?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[#1E3A8A] font-bold text-lg mb-3 flex items-center gap-2">
                    <HiTag className="w-5 h-5" />
                    Skills & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Poster */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  <HiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Posted by {job.postedBy?.firstName} {job.postedBy?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Applications sent to{" "}
                    {job.contactEmail || job.postedBy?.email}
                  </p>
                </div>
              </div>

              {/* Apply */}
              <button
                onClick={() => setApplyOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm sm:text-base py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.01] transition-all"
              >
                <HiMail className="w-4 h-4" />
                Apply for this Job
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <ApplyModal
        open={applyOpen}
        job={job}
        onClose={(success) => {
          setApplyOpen(false);
          if (success) {
            showToast("Your application has been submitted successfully.");
          }
        }}
        onError={(message) => showToast(message, "error")}
      />
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
