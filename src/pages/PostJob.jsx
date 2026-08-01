import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiBriefcase,
  HiCheckCircle,
  HiLightningBolt,
  HiUsers,
  HiGlobeAlt,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { api, getToken } from "../api/client";
import Navbar from "../components/Navbar";

const categories = ["UI/UX", "Front End", "Back End", "Data Science", "Sales", "Other"];
const employmentTypes = ["Full Time", "Part Time", "Hourly", "Fixed-Rate", "Worldwide"];

const tips = [
  {
    icon: HiLightningBolt,
    title: "Be Specific",
    desc: "Clear titles and requirements attract the right candidates faster.",
  },
  {
    icon: HiUsers,
    title: "Show Your Culture",
    desc: "A few sentences about your team goes a long way in building trust.",
  },
  {
    icon: HiGlobeAlt,
    title: "Think Global",
    desc: "Hiring worldwide? Say so — and open your role to every timezone.",
  },
];

const emptyForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  description: "",
  category: "UI/UX",
  employmentType: "Full Time",
  tags: "",
  contactEmail: "",
};

export default function PostJob() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...emptyForm,
    contactEmail: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Job title is required";
    if (!form.company.trim()) next.company = "Company name is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.contactEmail.trim() || !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      next.contactEmail = "A valid contact email is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await api.createJob(payload, getToken());
      setPosted(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition ${
      hasError ? "border-red-300" : "border-gray-200"
    }`;

  const canPost =
    user?.role === "admin" || (user?.accountType === "poster" && user?.isVerified);

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
            Post a Job
          </motion.span>
          <motion.h1
            className="text-[#161B39] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {user
              ? `Hire the Best, ${user.firstName}`
              : "Hire the Best, Anywhere"}
          </motion.h1>
          <motion.p
            className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Publish your opening in minutes and reach qualified candidates in
            190+ countries — free forever.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          {/* Tips */}
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <tip.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="text-[#1E3A8A] font-bold text-base mb-1">
                  {tip.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tip.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Form / Success */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {posted ? (
              <div className="text-center py-12">
                <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-[#1E3A8A] font-bold text-2xl mb-2">
                  Job Posted!
                </h2>
                <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-8">
                  "{"{form.title}"}" at {form.company} is now live and visible
                  to candidates worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setPosted(false);
                      setForm(emptyForm);
                      setErrors({});
                    }}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition"
                  >
                    <HiBriefcase className="w-4 h-4" />
                    Post Another Job
                  </button>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-[#1E3A8A] font-bold text-2xl sm:text-3xl mb-1 flex items-center gap-3">
                  <HiBriefcase className="w-6 h-6 text-[#2563EB]" />
                  Create a Job Post
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  Fill in the details below — it takes less than a minute.
                </p>

                {!canPost && (
                  <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">
                    <p className="font-semibold mb-0.5">
                      {user?.accountType === "poster" && !user?.isVerified
                        ? "Verify your email to start posting"
                        : "This account can't post jobs"}
                    </p>
                    <p>
                      {user?.accountType === "poster" && !user?.isVerified
                        ? "Open the verification link from the server console or your dashboard, then try again."
                        : "Sign up as a job poster and verify your email to post jobs."}
                    </p>
                  </div>
                )}

                {errors.submit && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {errors.submit}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior React Developer"
                      className={fieldClass(errors.title)}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="e.g. TechCorp"
                        className={fieldClass(errors.company)}
                      />
                      {errors.company && (
                        <p className="text-xs text-red-500 mt-1">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Remote / New York"
                        className={fieldClass(errors.location)}
                      />
                      {errors.location && (
                        <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                        placeholder="e.g. $90k - $120k"
                        className={fieldClass(false)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={fieldClass(false)}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Employment Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {employmentTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, employmentType: type })
                          }
                          className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all ${
                            form.employmentType === type
                              ? "bg-[#1E3A8A] text-white"
                              : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className={`${fieldClass(errors.description)} resize-none`}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={form.contactEmail}
                      onChange={handleChange}
                      placeholder="Applications will be sent to this email"
                      className={fieldClass(errors.contactEmail)}
                    />
                    {errors.contactEmail && (
                      <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tags{" "}
                      <span className="text-gray-400 font-normal">
                        (comma separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="e.g. React, TypeScript, Tailwind"
                      className={fieldClass(false)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link
                      to="/"
                      className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 transition text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-semibold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Posting..." : "Post Job"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
