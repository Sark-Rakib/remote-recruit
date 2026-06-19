import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi";

const features = [
  "Up to 25 active job posts",
  "Premium Placement & Visibility",
  "Messaging anyone, unlimited",
  "Unlimited invites",
  "View all applicants",
  "Unlimited invites to jobseekers",
];

export default function FeatureBlocks() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white  overflow-hidden p-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-20">
            {/* leftside */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-4xl shadow-[0_8px_40px_rgba(59,130,246,0.10)]">
              <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mb-1">
                Your Membership Tier
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2563EB] tracking-tight">
                Premium
              </h2>

              <div className="mt-6 sm:mt-8">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3 sm:mb-4">
                  Features
                </p>
                <ul className="space-y-2.5 sm:space-y-3">
                  {features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 sm:gap-3"
                    >
                      <span className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiCheck className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" />
                      </span>
                      <span className="text-sm sm:text-base text-gray-700">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 shadow-[0_8px_40px_rgba(59,130,246,0.10)] rounded-full p-1 z-50 -ml-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-base">
                    RR
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">
                    Upcoming Payment In...
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    14 Days -{" "}
                    <span className="font-bold text-gray-800">$79.99</span>
                  </p>
                </div>
              </div>
            </div>

            {/*right side*/}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <span className="inline-block bg-[#DBEAFE] text-[#2563EB] text-[10px] sm:text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 w-fit">
                Actually Fee Free
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3A8A] tracking-tight leading-tight">
                Fee-Free Forever
              </h3>

              <p className="text-sm sm:text-base text-gray-500 mt-4 leading-relaxed max-w-md">
                We don't charge you fees and we don't put up paywalls. We're the
                bridge that connects job opportunities with the best candidates,
                with no middleman involved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
