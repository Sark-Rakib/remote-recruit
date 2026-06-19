import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="bg-[#FAFAFC] py-16 md:py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#D9F3FF] text-[#4A90B5] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              Custom Profile
            </span>

            <h2 className="text-[#161B39] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight max-w-lg">
              Showcase Your Talents
            </h2>

            <p className="text-[#6B7280] text-base sm:text-lg mt-5 leading-relaxed max-w-lg">
              Personalize your profile with everything that makes you unique.
              Add an introductory video and other media for a personal touch
              that stands out to employers and candidates.
            </p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="relative mt-8 md:mt-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Main Card */}
            <div className="relative bg-white rounded-[28px] shadow-[0_20px_60px_rgba(40,60,120,0.12)] p-5 sm:p-6 lg:p-7 max-w-md mx-auto md:mx-0 md:ml-auto">
              {/* Dashboard header */}
              <div className="bg-linear-to-r from-[#6C3BF1] to-[#4F46E5] rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4">
                <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
                  <span className="font-semibold">Dashboard</span>
                  <span className="opacity-70">Profile Views &gt;</span>
                </div>
                <div className="text-white text-xl sm:text-2xl font-bold">
                  1,847
                </div>
                <div className="text-white/60 text-[10px] sm:text-xs">
                  Total Profile Views
                </div>
              </div>

              {/* Profile card inside */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  FB
                </div>
                <div>
                  <div className="text-[#161B39] font-semibold text-sm sm:text-base">
                    fatima
                  </div>
                  <div className="text-[#6B7280] text-xs sm:text-sm">UI/UX</div>
                </div>
              </div>

              {/* Video thumbnail */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-linear-to-br from-indigo-900 to-purple-900 aspect-video flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                <motion.div
                  className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#6C3BF1]/80 flex items-center justify-center cursor-pointer z-10"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                </motion.div>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Python Dev",
                  "Javascript",
                  "Front End",
                  "Back End",
                  "IOS Development",
                  "+12",
                ].map((skill) => (
                  <span
                    key={skill}
                    className={`text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-full ${
                      skill === "+12"
                        ? "bg-[#D9F3FF] text-[#4A90B5]"
                        : "bg-gray-100 text-[#6B7280]"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating review card */}
            <motion.div
              className="absolute bottom-67 sm:bottom-75 lg:bottom-81 lg:left-24 -left-4 sm:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-[0_10px_30px_rgba(40,60,120,0.12)] p-3 sm:p-4 max-w-[180px] sm:max-w-[200px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold">
                  JD
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#4A90B5] font-medium">
                  Past Client Feedback
                </div>
              </div>
              <div className="text-[#161B39] font-bold text-xs sm:text-sm">
                Best Developer Ever!
              </div>
            </motion.div>

            {/* Floating profile image - right */}
            <motion.div
              className="absolute -top-3 -right-3 sm:-right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-pink-400 to-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm sm:text-base"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              FB
            </motion.div>

            {/* Floating blue circle */}
            <motion.div
              className="absolute -top-6 -left-2 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D9F3FF]/60 border border-[#4A90B5]/20"
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating small dot */}
            <motion.div
              className="absolute top-1/2 -right-3 sm:-right-4 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#6C3BF1]/20"
              animate={{ y: [4, -4, 4] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
