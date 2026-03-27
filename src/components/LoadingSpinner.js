// Reusable spinner component for loading states
export function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-2 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin"></div>
      </div>
      {text && <p className="text-slate-400 text-sm">{text}</p>}
    </div>
  );
}

// Inline spinner for buttons
export function InlineSpinner() {
  return (
    <div className="inline-block w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin mr-2"></div>
  );
}

// Full screen loading overlay
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <LoadingSpinner size="lg" text="Processing..." />
      </div>
    </div>
  );
}
