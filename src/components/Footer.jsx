import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import {
  HiMail,
  HiLocationMarker,
  HiPhone,
  HiPaperAirplane,
  HiCheck,
} from "react-icons/hi";

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaXTwitter, label: "X (Twitter)" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaYoutube, label: "YouTube" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "How It Works", to: "/about" },
];

const candidateLinks = [
  { label: "Browse Jobs", to: "/jobs" },
  { label: "Create Account", to: "/signup" },
  { label: "Sign In", to: "/signin" },
];

const employerLinks = [
  { label: "Post a Job", to: "/post-job" },
  { label: "Employer Dashboard", to: "/dashboard" },
];

const contactItems = [
  { Icon: HiMail, label: "remoterecruitt@gmail.com" },
  { Icon: HiPhone, label: "+880 1745 762857" },
  { Icon: HiLocationMarker, label: "100 Remote Way, Dhaka, Bangladesh" },
];

const linkClasses =
  "text-white/75 hover:text-white text-sm transition-colors duration-200";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-[#3D79C3] via-[#2E63B2] to-[#234F9D]">
      {/* Decorative shapes */}
      <div className="absolute -left-32 -bottom-40 w-[420px] h-[420px] rounded-full bg-white/5" />
      <div className="absolute -right-24 -top-32 w-[380px] h-[380px] rounded-full bg-white/5" />
      <div className="absolute right-14 top-12 w-[220px] h-[160px] rounded-full border border-white/10" />

      <div className="relative z-20 px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr_1.1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-2xl font-bold leading-tight">
                <span className="block text-[#6BE0F8]">Remote</span>
                <span className="block text-white">Recruit</span>
              </span>
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-xs">
              The global remote job board. Connect with talent and opportunities
              anywhere in the world — no barriers, no fees.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mt-6">
              <p className="text-white/90 text-sm font-semibold mb-2">
                Get new remote jobs in your inbox
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 text-sm text-white">
                  <HiCheck className="w-4 h-4 text-[#6BE0F8]" />
                  You're subscribed. Welcome aboard!
                </div>
              ) : (
                <div className="flex max-w-sm bg-white rounded-xl p-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    aria-label="Email for job alerts"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center gap-1.5 bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <HiPaperAirplane className="w-4 h-4" />
                    Subscribe
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              For Candidates
            </h3>
            <ul className="space-y-3">
              {candidateLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              For Employers
            </h3>
            <ul className="space-y-3">
              {employerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {contactItems.map(({ Icon, label }) => (
                <li key={label} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-[#6BE0F8] mt-0.5 shrink-0" />
                  <span className="text-white/75 text-sm">{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">
                Follow Us
              </h3>
              <div className="flex gap-2">
                {socials.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#234F9D] transition-colors"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} RemoteRecruit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
