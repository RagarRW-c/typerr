export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-zinc-200 dark:border-zinc-700 border-t-indigo-600 rounded-full animate-spin`} />
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass-card p-8 rounded-2xl text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">{message}</p>
      </div>
    </div>
  );
}

export function LoadingButton({ 
  loading, 
  children, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button {...props} disabled={loading || props.disabled} className={props.className}>
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </span>
      ) : children}
    </button>
  );
}
