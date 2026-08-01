export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
      {Icon && (
        <Icon className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      )}
      <p className="text-gray-500 dark:text-gray-400 font-semibold">{title}</p>
      {description && (
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
