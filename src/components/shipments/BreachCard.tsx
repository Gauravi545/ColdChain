'use client';
import { BreachEvent } from '@/types';
import { formatTimestamp, formatTemp } from '@/lib/utils';
import { BREACH_SEVERITY_LABELS, ROLE_LABELS } from '@/lib/constants';
import { AlertTriangle, Clock, User, Link2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { BLOCKCHAIN_EXPLORER_URL } from '@/lib/constants';
import { truncateTxHash } from '@/lib/utils';

interface BreachCardProps {
  breach: BreachEvent;
  isActive?: boolean;
}

const SEVERITY_CLASSES = {
  low: 'border-amber-500/30 bg-amber-500/5',
  medium: 'border-orange-500/30 bg-orange-500/5',
  high: 'border-red-500/30 bg-red-500/5',
  critical: 'border-rose-500/40 bg-rose-500/8',
};

const SEVERITY_BADGE: Record<string, 'warning' | 'breach'> = {
  low: 'warning',
  medium: 'warning',
  high: 'breach',
  critical: 'breach',
};

export function BreachCard({ breach, isActive }: BreachCardProps) {
  return (
    <div className={cn(
      'glass-card border rounded-xl p-5',
      SEVERITY_CLASSES[breach.severity],
      isActive && 'ring-1 ring-red-500/30'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className={breach.severity === 'critical' || breach.severity === 'high' ? 'text-red-400' : 'text-amber-400'} />
          <span className="font-semibold text-slate-100">
            {isActive ? '⚠ ACTIVE BREACH' : 'Temperature Breach'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={SEVERITY_BADGE[breach.severity]} size="sm">
            {BREACH_SEVERITY_LABELS[breach.severity]}
          </Badge>
          {breach.isResolved && (
            <Badge variant="safe" size="sm">
              <CheckCircle2 size={10} className="mr-1" />
              Resolved
            </Badge>
          )}
        </div>
      </div>

      {/* Core breach info — prominent */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Recorded Temp</p>
          <p className="text-xl font-bold font-mono text-red-400">{formatTemp(breach.maxTemperature)}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Allowed Max</p>
          <p className="text-xl font-bold font-mono text-slate-400">{formatTemp(breach.allowedMax)}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Duration</p>
          <p className="text-xl font-bold font-mono text-amber-400">{breach.durationMinutes} min</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Exceedance</p>
          <p className="text-xl font-bold font-mono text-red-400">+{(breach.maxTemperature - breach.allowedMax).toFixed(1)}°C</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between">
          <span className="flex items-center gap-1 text-slate-500"><Clock size={11} />Breach start</span>
          <span className="text-slate-300">{formatTimestamp(breach.startTime)}</span>
        </div>
        {breach.endTime && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-slate-500"><Clock size={11} />Breach end</span>
            <span className="text-slate-300">{formatTimestamp(breach.endTime)}</span>
          </div>
        )}
      </div>

      {/* Accountability — visually prominent */}
      <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
          Responsible Custody Window
        </p>
        <div className="flex items-center gap-2 mb-1">
          <User size={14} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-100">{breach.responsibleCustodian}</span>
          <Badge variant="warning" size="sm">{ROLE_LABELS[breach.responsibleCustodianRole]}</Badge>
        </div>
        <p className="text-xs text-slate-500 ml-5">
          {formatTimestamp(breach.custodyWindowStart)}
          {breach.custodyWindowEnd ? ` — ${formatTimestamp(breach.custodyWindowEnd)}` : ' — ongoing'}
        </p>
      </div>

      {/* Blockchain */}
      {breach.blockchainTxHash && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Link2 size={11} className="text-violet-400" />
            <span className="text-slate-500">Blockchain event</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${BLOCKCHAIN_EXPLORER_URL}/tx/${breach.blockchainTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-violet-400 hover:text-violet-300"
              title={breach.blockchainTxHash}
            >
              {truncateTxHash(breach.blockchainTxHash)}
            </a>
            <Badge variant="verified" size="sm">✓ Verified</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
