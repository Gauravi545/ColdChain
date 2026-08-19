import { cn } from '@/lib/utils';

// Generic loading spinner
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sz = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size];
  return (
    <svg className={cn('animate-spin text-cyan-500', sz, className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

// Full-screen or section loading skeleton
export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

// Empty state
export function EmptyState({ icon, title, message }: { icon?: React.ReactNode; title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {icon && <div className="text-slate-600 mb-2">{icon}</div>}
      <p className="text-sm font-semibold text-slate-400">{title}</p>
      {message && <p className="text-xs text-slate-600 max-w-xs">{message}</p>}
    </div>
  );
}

// Error state
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-xl">
        ⚠
      </div>
      <p className="text-sm font-semibold text-slate-400">Something went wrong</p>
      {message && <p className="text-xs text-slate-600">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-cyan-400 hover:underline mt-1"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// Card skeleton loader
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn('h-3 bg-slate-800 rounded animate-pulse', i === lines - 1 ? 'w-1/2' : 'w-full')} />
      ))}
    </div>
  );
}
