import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HiLocationMarker,
  HiSearch,
  HiChevronDown,
  HiBriefcase,
  HiArrowRight,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import Navbar from "../components/Navbar";

const categories = ["All", "UI/UX", "Front End", "Back End", "Data Science", "Sales", "Other"];
const employmentTypes = ["Full Time", "Part Time", "Hourly", "Fixed-Rate", "Worldwide"];

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTypes, setActiveTypes] = useState([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        search: search || undefined,
        category: activeCategory === "All" ? undefined : activeCategory,
      });
      setJobs(data.jobs);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  useEffect(() => {
    const delay = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(delay);
  }, [fetchJobs]);

  const toggleType = (type) =>
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const visibleJobs =
    activeTypes.length === 0
      ? jobs
      : jobs.filter((job) => activeTypes.includes(job.employmentType));

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 pt-[70px]">
      <Navbar />

      {/* Hero */}
      <section className="py-14 sm:py-18 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="inline-block bg-[#D9F3FF] text-[#4A90B5] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Jobs
          </motion.span>
          <motion.h1
            className="text-[#161B39] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Next Remote Job
            <br />
            <span className="bg-linear-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent">
              Is Waiting
            </span>
          </motion.h1>
          <motion.p
            className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse thousands of remote opportunities from companies around the
            world. No account needed to search and apply.
          </motion.p>
        </div>
      </section>

      {/* Job list */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + filters */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs by title, company, or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition"
                />
              </div>
              <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition whitespace-nowrap">
                Most Recent Jobs
                <HiChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all ${
                    activeCategory === cat
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Employment type filters */}
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-400 mr-1">
                Employment Type:
              </span>
              {employmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all ${
                    activeTypes.includes(type)
                      ? "bg-[#0D9488] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
              {activeTypes.length > 0 && (
                <button
                  onClick={() => setActiveTypes([])}
                  className="text-xs font-medium text-[#1E3A8A] hover:underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          {/* Section title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
              <HiBriefcase className="w-5 h-5" />
              Available Jobs
            </h2>
            <span className="text-sm text-[#1E3A8A] font-medium">
              {visibleJobs.length} {visibleJobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>

          {/* Error banner */}
          {error && !loading && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 border border-gray-100 bg-white animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && visibleJobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <HiOutlineOfficeBuilding className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">No jobs found</p>
              <p className="text-gray-500 text-sm">
                Try a different search or category.
              </p>
            </div>
          )}

          {/* Job cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {visibleJobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3) }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug text-[#1E3A8A]">
                    {job.title}
                  </h3>
                  <span className="flex-shrink-0 text-xs font-semibold text-gray-400">
                    {job.salary}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                  <span className="text-xs text-gray-500">{job.company}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <HiLocationMarker className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">{job.location}</span>
                  </div>
                  {job.employmentType && (
                    <span className="text-xs text-gray-400">
                      {job.employmentType}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="text-xs sm:text-sm leading-relaxed mb-3 text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                )}

                <div className="mt-auto pt-3">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {job.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs font-medium px-2.5 py-0.5 sm:py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-gray-400">
                      Posted {formatDate(job.createdAt)} by {job.postedBy?.firstName}{" "}
                      {job.postedBy?.lastName}
                    </span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 px-3.5 py-2 rounded-lg transition whitespace-nowrap"
                    >
                      View Details
                      <HiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
