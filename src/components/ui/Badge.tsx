import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'safe' | 'warning' | 'breach' | 'offline' | 'syncing' | 'verified' | 'pending';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const VARIANTS = {
  default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  breach: 'bg-red-500/10 text-red-400 border-red-500/20',
  offline: 'bg-slate-600/10 text-slate-400 border-slate-500/20',
  syncing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  verified: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  pending: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const DOT_COLORS = {
  default: 'bg-slate-400',
  safe: 'bg-emerald-400',
  warning: 'bg-amber-400',
  breach: 'bg-red-400',
  offline: 'bg-slate-400',
  syncing: 'bg-amber-400',
  verified: 'bg-violet-400',
  pending: 'bg-blue-400',
};

export function Badge({ children, variant = 'default', size = 'sm', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        VARIANTS[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('inline-block rounded-full', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', DOT_COLORS[variant])} />
      )}
      {children}
    </span>
  );
}
