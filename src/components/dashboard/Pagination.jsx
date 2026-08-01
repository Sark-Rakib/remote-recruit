import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;

  const items = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) {
      items.push(i);
    } else if (items[items.length - 1] !== "…") {
      items.push("…");
    }
  }

  const btnBase =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed";
  const btnIdle =
    "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800";
  const btnActive = "bg-[#1E3A8A] dark:bg-[#2563EB] text-white";

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-6 flex-wrap" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${btnBase} ${btnIdle}`}
        aria-label="Previous page"
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      {items.map((item, i) =>
        item === "…" ? (
          <span key={`e${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${btnBase} ${
              item === page ? btnActive : btnIdle
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className={`${btnBase} ${btnIdle}`}
        aria-label="Next page"
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
