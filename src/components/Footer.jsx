import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaSnapchat,
} from "react-icons/fa6";

export default function CTAFooter() {
  return (
    <section className="relative pt-20 bg-white overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#151B3B]">
          Help Is One Click Away
        </h2>
      </div>

      {/* Pricing Cards */}
      <div className="relative z-30 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-white rounded-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6">
            <div className="flex gap-6">
              <div className="w-[110px] h-[100px] rounded-2xl bg-[#EEF3FB] flex flex-col justify-center items-center">
                <h3 className="text-[#58B7E8] font-bold text-3xl">Free</h3>
                <p className="text-gray-400">Basic</p>
              </div>

              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li>✓ 1 Active Job</li>
                <li>✓ Basic List Placement</li>
                <li className="text-gray-400">✕ Unlimited Job Applicants</li>
                <li className="text-gray-400">
                  ✕ Invite Anyone to Apply to Your Jobs
                </li>
              </ul>
            </div>

            <button className="mt-6 w-full h-14 rounded-2xl border-2 border-[#3774C8] text-[#234F9D] font-semibold">
              Get Started
            </button>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6">
            <div className="flex gap-6">
              <div className="w-[110px] h-[100px] rounded-2xl bg-[#EEF3FB] flex flex-col justify-center items-center relative">
                <span className="absolute -top-3 px-3 py-1 text-xs rounded-full bg-[#DDF4FF] text-[#234F9D] font-semibold">
                  Premium
                </span>

                <h3 className="text-[#58B7E8] font-bold text-3xl">$79.99</h3>
                <p className="text-gray-400">Per Month</p>
              </div>

              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li>✓ Unlimited Job Posts</li>
                <li>✓ Instant Job Post Approval</li>
                <li>✓ Premium List Placement</li>
                <li>✓ Unlimited Job Applicants</li>
              </ul>
            </div>

            <button className="mt-10 w-full h-14 rounded-2xl bg-linear-to-r from-[#4B8DD7] to-[#234F9D] text-white font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative -mt-10 pt-32 pb-16 overflow-hidden bg-linear-to-b from-[#3D79C3] via-[#2E63B2] to-[#234F9D]">
        {/* Top Wave */}
        <svg
          className="absolute top-0 left-0 w-full h-[90px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,55 C250,90 500,0 800,35 C1100,70 1280,75 1440,55 L1440,0 L0,0 Z"
          />
        </svg>

        {/* Decorative Shapes */}
        <div className="absolute -left-40 bottom-[-250px] w-[500px] h-[500px] rounded-full bg-white/5" />

        <div className="absolute right-[-180px] top-0 w-[500px] h-[320px] rounded-full bg-white/5" />

        <div className="absolute right-10 top-10 w-[350px] h-[250px] rounded-full border border-white/10" />

        {/* Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div>
              <h2 className="leading-none">
                <span className="block text-[34px] font-bold text-[#69D9F7]">
                  Remote
                </span>
                <span className="block text-[34px] font-bold text-white">
                  Recruit
                </span>
              </h2>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {[
                FaFacebookF,
                FaInstagram,
                FaXTwitter,
                FaLinkedinIn,
                FaSnapchat,
              ].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80"
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-4 flex justify-center">
            <span className="text-white/70 font-bold text-xl">RR</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
