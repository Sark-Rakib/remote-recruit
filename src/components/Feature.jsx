import { motion } from "framer-motion";
import { HiSearch, HiChevronDown, HiLocationMarker } from "react-icons/hi";

const jobs = [
  {
    title: "Senior UI/UX Designer needed for ongoing support",
    company: "Bungle",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    tags: ["Figma", "Design Systems", "User Research"],
    active: true,
  },
  {
    title: "Frontend Developer for SaaS Platform",
    company: "CloudScale Inc.",
    location: "Remote",
    salary: "$90k - $130k",
    tags: ["React", "TypeScript", "Tailwind"],
    active: false,
  },
];

export default function Feature() {
  return (
    <section className="relative bg-white overflow-hidden pt-[70px]">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/40 via-white to-white pointer-events-none" />

      {/* Decorative blue dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-24 left-[8%] w-3 h-3 rounded-full bg-[#3B82F6]/15"
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="absolute top-32 right-[12%] w-5 h-5 rounded-full bg-[#3B82F6]/10"
          animate={{ y: [0, -18, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <motion.div
          className="absolute bottom-48 left-[15%] w-4 h-4 rounded-full bg-[#3B82F6]/12"
          animate={{ y: [0, -14, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
        <motion.div
          className="absolute top-48 right-[5%] w-2.5 h-2.5 rounded-full bg-[#3B82F6]/20"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-[5%] w-6 h-6 rounded-full bg-[#3B82F6]/8"
          animate={{ y: [0, -16, 0] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-[45%] w-3 h-3 rounded-full bg-[#2563EB]/10"
          animate={{ y: [0, -11, 0] }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-[20%] w-4 h-4 rounded-full bg-[#3B82F6]/10"
          animate={{ y: [0, -13, 0] }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh] py-16 lg:py-0">
          {/* ===== LEFT: TEXT CONTENT ===== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#D9F3FF] text-[#4A90B5] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              Global Reach
            </span>

            <h1 className="text-[#161B39] font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight max-w-xl">
              The First Fully Global Job Board, Anywhere, Ever
            </h1>

            <p className="text-[#6B7280] text-base sm:text-lg mt-6 leading-relaxed max-w-lg">
              RemoteRecruit connects candidates with opportunities around the
              world. With today&apos;s remote-first workforce, you need to be
              able to find the best jobs and the best people for them, wherever
              they may be.
            </p>
          </motion.div>

          {/* ===== RIGHT: APP MOCKUP + TESTIMONIALS ===== */}
          <motion.div
            className="relative mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Main Mockup Card */}
            <div className="relative bg-white rounded-[24px] shadow-[0_20px_70px_rgba(30,58,138,0.12)] border border-gray-100/80 overflow-hidden">
              <div className="flex">
                {/* Left sidebar */}
                <div className="hidden sm:flex flex-col w-[160px] lg:w-[180px] bg-[#1E3A8A] px-4 py-6 flex-shrink-0">
                  <div className="mb-8">
                    <h2 className="text-sm font-bold tracking-tight text-white">
                      Remote <span className="text-blue-300">Recruit</span>
                    </h2>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {[
                      { label: "Find Work", active: true },
                      { label: "Your Jobs", active: false },
                      { label: "Settings", active: false },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        className={`block px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                          item.active
                            ? "bg-white/15 text-white"
                            : "text-blue-200/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2.5 text-[11px] text-blue-200/70">
                      <div className="w-7 h-7 rounded-full bg-blue-400/30 flex items-center justify-center text-white font-bold text-[10px]">
                        M
                      </div>
                      <span>Max</span>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0 px-4 sm:px-5 py-5">
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-400">Welcome Max</p>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E3A8A] mt-0.5">
                      Let&apos;s Find Work
                    </h3>
                  </div>

                  {/* Search row */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                      <HiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-[11px] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/10"
                      />
                    </div>
                    <button className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[11px] text-gray-500 whitespace-nowrap">
                      Most Recent
                      <HiChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {[
                      "UI/UX",
                      "Front End",
                      "Back End",
                      "Data Science",
                      "Sales",
                    ].map((cat, i) => (
                      <span
                        key={cat}
                        className={`text-[9px] sm:text-[10px] font-medium px-2.5 py-1 rounded-full ${
                          i === 0
                            ? "bg-[#1E3A8A] text-white"
                            : "bg-white text-gray-500 border border-gray-200"
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Section title */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[13px] font-bold text-[#1E3A8A]">
                      Recent Jobs
                    </h4>
                    <span className="text-[11px] text-[#1E3A8A] font-medium">
                      View All
                    </span>
                  </div>

                  {/* Job cards */}
                  <div className="space-y-2.5">
                    {jobs.map((job) => (
                      <div
                        key={job.title}
                        className={`rounded-xl p-3 border transition-shadow ${
                          job.active
                            ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                            : "bg-white text-gray-900 border-gray-100 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5
                            className={`text-[11px] font-semibold leading-snug ${
                              job.active ? "text-white" : "text-[#1E3A8A]"
                            }`}
                          >
                            {job.title}
                          </h5>
                          <span
                            className={`flex-shrink-0 text-[10px] font-semibold ${
                              job.active ? "text-blue-200" : "text-gray-400"
                            }`}
                          >
                            {job.salary}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span
                            className={`text-[10px] ${
                              job.active ? "text-blue-200" : "text-gray-500"
                            }`}
                          >
                            {job.company}
                          </span>
                          <div className="flex items-center gap-1 text-[10px]">
                            <HiLocationMarker
                              className={`w-3 h-3 ${
                                job.active ? "text-blue-300" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={
                                job.active ? "text-blue-200" : "text-gray-500"
                              }
                            >
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[8px] sm:text-[9px] font-medium px-2 py-0.5 rounded-full ${
                                job.active
                                  ? "bg-white/15 text-blue-100"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right filter panel */}
                <div className="hidden lg:flex flex-col w-[170px] flex-shrink-0 px-4 py-5 border-l border-gray-100">
                  <h4 className="text-[11px] font-bold text-[#1E3A8A] mb-3">
                    Filters
                  </h4>
                  {[
                    "Full Time",
                    "Part Time",
                    "Hourly",
                    "Fixed-Rate",
                    "Worldwide",
                  ].map((f) => (
                    <label
                      key={f}
                      className="flex items-center gap-2 text-[11px] text-gray-500 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={f === "Part Time" || f === "Fixed-Rate"}
                        className="w-3 h-3 rounded border-gray-300 text-[#1E3A8A]"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlapping RR logo badge */}
            <motion.div
              className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2563EB] shadow-lg shadow-blue-500/25 flex items-center justify-center z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5, type: "spring" }}
            >
              <span className="text-white font-extrabold text-sm sm:text-base tracking-tight">
                RR
              </span>
            </motion.div>

            {/* Testimonial bubble 1 — Python Developer */}
            <motion.div
              className="absolute -bottom-4 -left-4 sm:-left-6 lg:-left-10 bg-white rounded-[16px] shadow-[0_10px_30px_rgba(30,58,138,0.10)] p-3 sm:p-3.5 flex items-center gap-3 max-w-[200px] sm:max-w-[220px] z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs flex-shrink-0">
                FG
              </div>
              <div>
                <p className="text-[#161B39] font-semibold text-[11px] sm:text-xs leading-tight">
                  Python Developer
                </p>
                <p className="text-gray-400 text-[10px] sm:text-[11px]">
                  Felonious Gru
                </p>
              </div>
            </motion.div>

            {/* Testimonial bubble 2 — Front End Wizard */}
            <motion.div
              className="absolute -bottom-12 sm:-bottom-14 -right-3 sm:-right-4 bg-white rounded-[16px] shadow-[0_10px_30px_rgba(30,58,138,0.10)] p-3 sm:p-3.5 flex items-center gap-3 max-w-[200px] sm:max-w-[220px] z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs flex-shrink-0">
                MM
              </div>
              <div>
                <p className="text-[#161B39] font-semibold text-[11px] sm:text-xs leading-tight">
                  Front End Wizard
                </p>
                <p className="text-gray-400 text-[10px] sm:text-[11px]">
                  Mel Muselpheim
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
