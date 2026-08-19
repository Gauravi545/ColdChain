import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'red' | 'amber' | 'violet';
  trend?: { value: number; label: string };
  subtitle?: string;
  pulse?: boolean;
}

const COLOR_MAP = {
  cyan: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    value: 'text-cyan-400',
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    value: 'text-emerald-400',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    value: 'text-red-400',
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    value: 'text-amber-400',
  },
  violet: {
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    value: 'text-violet-400',
  },
};

export function StatCard({ label, value, icon: Icon, color = 'cyan', trend, subtitle, pulse }: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div className={cn('glass-card p-5 border relative overflow-hidden', colors.border)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className={cn('text-3xl font-bold', colors.value, pulse && 'breach-pulse')}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.value > 0 ? (
                <TrendingUp size={12} className="text-red-400" />
              ) : trend.value < 0 ? (
                <TrendingDown size={12} className="text-emerald-400" />
              ) : (
                <Minus size={12} className="text-slate-500" />
              )}
              <span className="text-xs text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', colors.bg)}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className={cn('absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl', colors.bg)} />
    </div>
  );
}
