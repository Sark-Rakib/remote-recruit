import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiClock,
  HiPaperAirplane,
  HiCheckCircle,
} from "react-icons/hi";
import Navbar from "../components/Navbar";

const contactInfo = [
  {
    icon: HiMail,
    label: "Email Us",
    value: "support@remoterecruit.com",
  },
  {
    icon: HiPhone,
    label: "Call Us",
    value: "+1 (555) 123-4567",
  },
  {
    icon: HiLocationMarker,
    label: "Visit Us",
    value: "100 Remote Way, San Francisco, CA",
  },
  {
    icon: HiClock,
    label: "Support Hours",
    value: "24/7 — Every Timezone",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "A valid email is required";
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  };

  const fieldClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition ${
      hasError ? "border-red-300" : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 pt-[70px]">
      <Navbar />
      {/* Hero */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="inline-block bg-[#D9F3FF] text-[#4A90B5] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.span>
          <motion.h1
            className="text-[#161B39] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Help Is Only
            <br />
            <span className="bg-linear-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent">
              A Click Away
            </span>
          </motion.h1>
          <motion.p
            className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you need help posting a job, finding talent, or navigating
            the platform — our team is ready around the clock.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <info.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                  {info.label}
                </p>
                <p className="text-[#1E3A8A] font-semibold text-sm">{info.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {sent ? (
              <div className="text-center py-10">
                <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-[#1E3A8A] font-bold text-2xl mb-2">
                  Message Sent!
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  Thanks for reaching out, {form.name.split(" ")[0] || "friend"}.
                  Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 inline-flex items-center gap-2 bg-[#1E3A8A] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#2563EB] transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-[#1E3A8A] font-bold text-2xl sm:text-3xl mb-1">
                  Send Us a Message
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  We usually reply within 24 hours.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={fieldClass(errors.name)}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={fieldClass(errors.email)}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={fieldClass(false)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className={`${fieldClass(errors.message)} resize-none`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm sm:text-base py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {sending ? "Sending..." : "Send Message"}
                    {!sending && <HiPaperAirplane className="w-4 h-4" />}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
