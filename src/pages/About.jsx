import { motion } from "framer-motion";
import {
  HiGlobeAlt,
  HiLightningBolt,
  HiCash,
  HiUsers,
  HiSparkles,
  HiShieldCheck,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const stats = [
  { value: "190+", label: "Countries Connected" },
  { value: "12,847+", label: "Active Candidates" },
  { value: "0%", label: "Fees Forever" },
  { value: "24/7", label: "Human Support" },
];

const values = [
  {
    icon: HiGlobeAlt,
    title: "Global Access",
    desc: "We break down borders so talent and opportunity can meet anywhere in the world.",
  },
  {
    icon: HiLightningBolt,
    title: "Speed & Simplicity",
    desc: "Our platform is built to get you hired or hired-out in as few clicks as possible.",
  },
  {
    icon: HiCash,
    title: "Fee-Free Forever",
    desc: "No paywalls, no commissions, no hidden charges. Ever. That's our promise.",
  },
  {
    icon: HiUsers,
    title: "Community First",
    desc: "Every feature starts with real people — candidates and employers working together.",
  },
];

export default function About() {
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
            About Us
          </motion.span>
          <motion.h1
            className="text-[#161B39] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The World's Job Board,
            <br />
            <span className="bg-linear-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent">
              Without the World's Barriers
            </span>
          </motion.h1>
          <motion.p
            className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            RemoteRecruit connects candidates with opportunities around the
            world. With today's remote-first workforce, you need to be able to
            find the best jobs and the best people for them, wherever they may
            be.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <p className="text-[#2563EB] font-extrabold text-3xl sm:text-4xl">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <HiSparkles className="w-8 h-8 text-[#2563EB] mx-auto mb-4" />
            <h2 className="text-[#1E3A8A] font-bold text-2xl sm:text-3xl mb-4">
              Our Mission
            </h2>
            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              We believe talent is evenly distributed around the world, but
              opportunity is not. Our mission is to fix that — by building the
              first truly global job board where anyone, anywhere, can
              showcase their talents to businesses that need them. With no
              paywalls, no fees, and no barriers, there's nothing between you
              and the next step in your career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-center text-[#1E3A8A] font-extrabold text-3xl sm:text-4xl tracking-tight mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What We Stand For
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-[#1E3A8A] font-bold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <HiShieldCheck className="w-5 h-5" />
              Join RemoteRecruit Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
