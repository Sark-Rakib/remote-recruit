import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative bg-linear-to-br from-remote-blue via-[#0f1440] to-remote-blue-light min-h-[85vh] flex items-center overflow-hidden pt-[70px]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-20 left-[10%] w-16 h-16 border border-white/10 rounded-full" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-40 right-[15%] w-24 h-24 bg-white/5 rounded-full" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        <motion.div className="absolute bottom-40 left-[20%] w-12 h-12 border border-white/10 rounded-lg rotate-45" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        <motion.div className="absolute top-60 left-[5%] w-8 h-8 bg-white/5 rounded-full" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
        <motion.div className="absolute bottom-60 right-[10%] w-20 h-20 border border-white/10 rounded-full" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        <motion.div className="absolute top-1/2 right-[5%] w-10 h-10 bg-white/5 rounded-lg rotate-12" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
        <motion.div className="absolute bottom-20 left-[30%] w-6 h-6 bg-white/5 rounded-full" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-32 lg:pb-40 text-center">
        <motion.h1
          className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          RemoteRecruit's{" "}
          <span className="bg-linear-to-r from-remote-purple-light to-remote-accent bg-clip-text text-transparent">
            Difference
          </span>
        </motion.h1>

        <motion.div
          className="text-white/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p>
            RemoteRecruit is connecting the world with an easy-to-use platform
            that lets full-time, part-time, and freelance workers showcase their
            talents to businesses that need them. With no paywalls, no fees, and
            no barriers, there's nothing but you, your talents, and the next
            step in your career.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 80C1200 70 1320 50 1380 40L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
