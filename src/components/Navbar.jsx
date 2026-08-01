import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiLogout } from "react-icons/hi";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The Home page starts on a dark hero, so the navbar needs a solid
  // background there (and whenever the menu is open / scrolled) or the
  // logo + links become unreadable — especially on mobile.
  const solid = scrolled || mobileOpen || location.pathname === "/";

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        solid
          ? mobileOpen
            ? "bg-remote-blue shadow-sm"
            : "bg-remote-blue/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      } ${solid ? "border-b border-white/10" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <Link to="/" className="flex flex-col items-center leading-tight">
            <span
              className={`font-extrabold italic text-sm sm:text-base transition-colors duration-300 ${
                solid ? "text-blue-500" : "text-blue-600"
              }`}
            >
              Remote
            </span>
            <span
              className={`font-extrabold italic text-sm sm:text-base transition-colors duration-300 ${
                solid ? "text-white" : "text-[#1E3A8A]"
              }`}
            >
              Recruit
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                solid
                  ? "text-white/85 hover:text-white"
                  : "text-gray-700 hover:text-[#1E3A8A]"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors duration-200 ${
                solid
                  ? "text-white/85 hover:text-white"
                  : "text-gray-700 hover:text-[#1E3A8A]"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors duration-200 ${
                solid
                  ? "text-white/85 hover:text-white"
                  : "text-gray-700 hover:text-[#1E3A8A]"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/jobs"
              className={`text-sm font-semibold px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                solid
                  ? "border-white/80 text-white hover:bg-white hover:text-[#1E3A8A]"
                  : "border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              }`}
            >
              Find Job
            </Link>
            {user ? (
              <>
                <Link
                  to="/post-job"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    solid
                      ? "bg-white text-[#1E3A8A] hover:bg-signup-bg hover:text-nav-start"
                      : "bg-[#2563EB] text-white hover:bg-[#1E3A8A] hover:shadow-lg"
                  }`}
                >
                  Post a Job
                </Link>
                {(user.accountType === "poster" || user.role === "admin") && (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors duration-200 ${
                      solid
                        ? "text-white/85 hover:text-white"
                        : "text-gray-700 hover:text-[#1E3A8A]"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors duration-200 ${
                      solid
                        ? "text-white/85 hover:text-white"
                        : "text-gray-700 hover:text-[#1E3A8A]"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      solid ? "bg-white/15 text-white" : "bg-[#1E3A8A] text-white"
                    }`}
                  >
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      solid ? "text-white/85" : "text-gray-700"
                    }`}
                  >
                    {user.firstName}
                    {user.role === "admin" && (
                      <span
                        className={`ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          solid
                            ? "bg-yellow-400/20 text-yellow-300"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        Admin
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                      solid
                        ? "text-white/85 hover:text-white"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                    aria-label="Sign out"
                  >
                    <HiLogout className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/post-job"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    solid
                      ? "bg-white text-[#1E3A8A] hover:bg-signup-bg hover:text-nav-start"
                      : "bg-[#2563EB] text-white hover:bg-[#1E3A8A] hover:shadow-lg"
                  }`}
                >
                  Post a Job
                </Link>
                <Link
                  to="/signin"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    solid
                      ? "text-white/85 hover:text-white"
                      : "text-gray-700 hover:text-[#1E3A8A]"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    solid
                      ? "bg-signup-bg text-signup-text hover:bg-white hover:text-nav-start"
                      : "bg-[#1E3A8A] text-white hover:bg-[#2563EB]"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`sm:hidden p-2 transition-colors ${
              solid ? "text-white" : "text-[#1E3A8A]"
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
              solid ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  solid
                    ? "text-white/85 hover:text-white"
                    : "text-gray-600 hover:text-[#1E3A8A]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  solid
                    ? "text-white/85 hover:text-white"
                    : "text-gray-600 hover:text-[#1E3A8A]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${
                  solid
                    ? "text-white/85 hover:text-white"
                    : "text-gray-600 hover:text-[#1E3A8A]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/jobs"
                className={`text-sm font-semibold px-5 py-2.5 rounded-lg border-2 transition-all duration-200 text-center ${
                  solid
                    ? "border-white/80 text-white hover:bg-white hover:text-[#1E3A8A]"
                    : "border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Find Job
              </Link>
              <Link
                to="/post-job"
                className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-center ${
                  solid
                    ? "bg-white text-[#1E3A8A] hover:bg-signup-bg hover:text-nav-start"
                    : "bg-[#2563EB] text-white hover:bg-[#1E3A8A]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Post a Job
              </Link>
              {user ? (
                <>
                  <div
                    className={`flex items-center gap-3 text-sm ${
                      solid ? "text-white/85" : "text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        solid ? "bg-white/15 text-white" : "bg-[#1E3A8A] text-white"
                      }`}
                    >
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <span>
                      {user.firstName} {user.lastName}
                      {user.role === "admin" && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                          Admin
                        </span>
                      )}
                    </span>
                  </div>
                  {(user.accountType === "poster" || user.role === "admin") && (
                    <Link
                      to="/dashboard"
                      className={`text-sm font-medium transition-colors ${
                        solid ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-[#1E3A8A]"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`text-sm font-medium transition-colors ${
                        solid ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-[#1E3A8A]"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-1.5 text-sm font-medium text-left transition-colors ${
                      solid ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <HiLogout className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={`text-sm font-medium transition-colors ${
                      solid ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-[#1E3A8A]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-center ${
                      solid
                        ? "bg-signup-bg text-signup-text hover:bg-white hover:text-nav-start"
                        : "bg-[#1E3A8A] text-white hover:bg-[#2563EB]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
