// Toast notification component
export function Toast({ message, type = "success", onClose }) {
  const styles = {
    success: "bg-green-900/30 border border-green-700 text-green-400",
    error: "bg-red-900/30 border border-red-700 text-red-400",
    warning: "bg-amber-900/30 border border-amber-700 text-amber-400",
    info: "bg-blue-900/30 border border-blue-700 text-blue-400",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 fade-in shadow-lg z-50 ${styles[type]}`}>
      <span className="flex-shrink-0 text-lg">{icons[type]}</span>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}

// Toast container component for multiple toasts
export function ToastContainer({ toasts, onRemove }) {
  return (
    <>
      {toasts.map((toast) => (
        <div key={toast.id}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </>
  );
}
