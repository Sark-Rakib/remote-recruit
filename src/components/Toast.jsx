import { motion, AnimatePresence } from "framer-motion";
import { HiCheckCircle, HiXCircle, HiX } from "react-icons/hi";

export default function Toast({ message, type = "success", onClose }) {
  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[60] w-[calc(100%-3rem)] max-w-sm">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-lg ${
              isSuccess
                ? "bg-white border-green-100"
                : "bg-white border-red-100"
            }`}
          >
            <span
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                isSuccess ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
              }`}
            >
              {isSuccess ? (
                <HiCheckCircle className="w-5 h-5" />
              ) : (
                <HiXCircle className="w-5 h-5" />
              )}
            </span>
            <p
              className={`flex-1 text-sm font-medium leading-snug pt-1.5 ${
                isSuccess ? "text-gray-800" : "text-gray-800"
              }`}
            >
              {message}
            </p>
            <button
              onClick={onClose}
              aria-label="Dismiss notification"
              className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <HiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
