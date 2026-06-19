import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiLocationMarker,
  HiSearch,
  HiChevronDown,
  HiHome,
  HiCog,
  HiClipboardList,
  HiArrowRight,
} from "react-icons/hi";

const navItems = [
  { icon: HiHome, label: "Find Work", active: true },
  { icon: HiClipboardList, label: "Your Jobs", active: false },
  { icon: HiCog, label: "Settings", active: false },
];

const categories = [
  { name: "UI/UX", active: true },
  { name: "Front End", active: false },
  { name: "Back End", active: false },
  { name: "Data Science", active: false },
  { name: "Sales", active: false },
];

const jobs = [
  {
    title: "Senior UI/UX Designer needed for ongoing support",
    company: "TechCorp International",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    tags: ["Figma", "Design Systems", "User Research"],
    highlighted: true,
  },
  {
    title: "Frontend Developer for SaaS Platform",
    company: "CloudScale Inc.",
    location: "Remote",
    salary: "$90k - $130k",
    tags: ["React", "TypeScript", "Tailwind"],
    highlighted: false,
  },
  {
    title: "Data Analyst - Marketing Analytics",
    company: "GrowthWorks Agency",
    location: "New York, NY",
    salary: "$85k - $110k",
    tags: ["SQL", "Python", "Tableau"],
    highlighted: false,
  },
];

const filters = [
  { name: "Full Time", checked: false },
  { name: "Part Time", checked: true },
  { name: "Hourly", checked: false },
  { name: "Fixed-Rate", checked: true },
  { name: "Worldwide", checked: false },
  { name: "Important", checked: false },
];

export default function SignUpAdd() {
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <div className="min-h-screen flex py-15">
      {/*left side bar*/}
      <aside className="hidden lg:flex flex-col w-[240px] bg-[#1E3A8A] text-white px-6 py-8 flex-shrink-0">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Remote <span className="text-blue-300">Recruit</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-blue-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 text-sm text-blue-200/80">
            <div className="w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span>Max</span>
          </div>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Welcome */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Welcome Max</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mt-1">
            Let's Find Work
          </h1>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition whitespace-nowrap">
            Most Recent Jobs
            <HiChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all ${
                cat.active
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1E3A8A]">Recent Jobs</h2>
          <span className="text-sm text-[#1E3A8A] font-medium hover:underline">
            View All
          </span>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-shadow ${
                job.highlighted
                  ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-lg shadow-[#1E3A8A]/15"
                  : "bg-white text-gray-900 border-gray-100 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className={`font-semibold text-sm sm:text-base leading-snug ${
                    job.highlighted ? "text-white" : "text-[#1E3A8A]"
                  }`}
                >
                  {job.title}
                </h3>
                <span
                  className={`flex-shrink-0 text-xs font-semibold ${
                    job.highlighted ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {job.salary}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={
                      job.highlighted ? "text-blue-200" : "text-gray-500"
                    }
                  >
                    {job.company}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <HiLocationMarker
                    className={`w-3.5 h-3.5 ${
                      job.highlighted ? "text-blue-300" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={
                      job.highlighted ? "text-blue-200" : "text-gray-500"
                    }
                  >
                    {job.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] sm:text-xs font-medium px-2.5 py-0.5 sm:py-1 rounded-full ${
                      job.highlighted
                        ? "bg-white/15 text-blue-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* right sidebar */}
      <aside className="hidden xl:flex flex-col w-[300px] flex-shrink-0 py-6 sm:py-8 lg:py-10 pr-4 sm:pr-6 lg:pr-8 gap-6">
        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1E3A8A]">Filters</h3>
            <div className="flex gap-2 text-[10px] text-gray-400">
              <button className="hover:text-gray-600 transition">
                Unselect All
              </button>
              <span>|</span>
              <button className="hover:text-gray-600 transition">
                Select All
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {filters.map((f) => (
              <label
                key={f.name}
                className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={f.checked}
                  className="w-4 h-4 rounded border-gray-300 text-[#1E3A8A] focus:ring-[#1E3A8A]/30"
                />
                {f.name}
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs text-gray-400 mb-1.5 block">
              Language
            </label>
            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button className="w-full mt-5 text-sm text-[#1E3A8A] font-medium bg-blue-50 rounded-lg py-2 hover:bg-blue-100 transition">
            Reset All Filters
          </button>
        </div>

        {/* Promo Card */}
        <div className="relative bg-linear-to-b from-[#E0E7FF] to-white rounded-2xl shadow-sm border border-indigo-100/50 p-6 pt-12 overflow-hidden">
          {/* Yellow circle */}
          <div className="absolute top-4 right-6 w-5 h-5 rounded-full bg-yellow-400/60" />
          {/* Blue circle */}
          <div className="absolute bottom-8 left-6 w-4 h-4 rounded-full bg-blue-400/40" />

          <div className="relative z-10">
            <h3 className="text-[#1E3A8A] font-bold text-base sm:text-lg leading-snug mb-2">
              Are you ready?
              <br />
              Help is only a few clicks away!
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5">
              Click Below to get set up super quickly and find help now!
            </p>

            <button className="inline-flex items-center gap-2 bg-linear-to-r from-[#2563EB] to-[#0D9488] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all">
              Get Started
              <HiArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chinonso tag */}
          <div className="mt-5 flex items-center gap-1.5 text-[10px] text-purple-500 font-medium">
            <span className="bg-purple-100 px-2 py-0.5 rounded">Chinonso</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </aside>
    </div>
  );
}
