export default function PricingSection() {
  return (
    <section className="relative pt-20 bg-white overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#151B3B]">
          Help Is One Click Away
        </h2>
      </div>

      {/* Pricing Cards */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 pb-24">
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
    </section>
  );
}
