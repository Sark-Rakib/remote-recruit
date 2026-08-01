import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiLogout, HiMoon, HiSun, HiHome } from "react-icons/hi";
import { useAuth } from "../../context/authContext";
import { useTheme } from "../../context/themeContext";

export default function DashboardShell({ navItems = [], pageTitle, children }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderSidebar = (onNavigate) => (
    <div className="flex flex-col h-full bg-[#1E3A8A] dark:bg-gray-900 text-white px-5 py-6">
      <div className="mb-8 px-1">
        <Link
          to="/"
          onClick={onNavigate}
          className="font-extrabold italic text-lg leading-tight"
        >
          Remote<span className="text-blue-300">Recruit</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const cls = item.active
            ? "flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/15 text-white shadow-sm text-sm font-medium"
            : "flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/5 text-sm font-medium transition";
          return item.active ? (
            <div key={item.label} className={cls}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </div>
          ) : (
            <Link key={item.label} to={item.to} onClick={onNavigate} className={cls}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-400/30 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-blue-200/70 capitalize truncate">
              {user?.role === "admin"
                ? "Administrator"
                : user?.accountType === "poster"
                ? "Job Poster"
                : "Applicant"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/5 text-sm font-medium transition"
        >
          <HiLogout className="w-5 h-5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
        {renderSidebar(null)}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 w-64 shadow-2xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
            >
              {renderSidebar(() => setMobileOpen(false))}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/85 dark:bg-gray-900/85 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Open menu"
            >
              <HiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-[#1E3A8A] dark:text-white truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <HiHome className="w-4 h-4" />
              Site
            </Link>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
