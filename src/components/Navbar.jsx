import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-remote-blue/80 backdrop-blur-md shadow-sm"
          : "bg-remote-blur/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <Link to="/" className="flex flex-col items-center leading-tight">
            <span
              className={`font-extrabold italic text-sm sm:text-base transition-colors duration-300 ${
                scrolled ? "text-blue-500" : "text-blue-600"
              }`}
            >
              Remote
            </span>
            <span
              className={`font-extrabold italic text-sm sm:text-base transition-colors duration-300 ${
                scrolled ? "text-white" : "text-white"
              }`}
            >
              Recruit
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/signin"
              className={`text-sm font-medium transition-colors duration-200 ${
                scrolled
                  ? "text-white/85 hover:text-white"
                  : "text-white hover:text-[#1E3A8A]"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                scrolled
                  ? "bg-signup-bg text-signup-text hover:bg-white hover:text-nav-start"
                  : "bg-[#1E3A8A] text-white hover:bg-[#2563EB]"
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`sm:hidden p-2 transition-colors ${
              scrolled ? "text-white" : "text-[#1E3A8A]"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className={`sm:hidden pb-4 border-t ${
              scrolled ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/signin"
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-white/85 hover:text-white"
                    : "text-gray-600 hover:text-[#1E3A8A]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-center ${
                  scrolled
                    ? "bg-signup-bg text-signup-text hover:bg-white hover:text-nav-start"
                    : "bg-[#1E3A8A] text-white hover:bg-[#2563EB]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
