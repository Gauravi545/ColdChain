'use client';
import { CustodyTransfer } from '@/types';
import { formatTimestamp, formatTemp, truncateTxHash } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';
import { CheckCircle2, Clock, Building2, Thermometer, MapPin, Link2, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { BLOCKCHAIN_EXPLORER_URL } from '@/lib/constants';

interface CustodyTimelineProps {
  transfers: CustodyTransfer[];
  originParty?: string;
}

export function CustodyTimeline({ transfers, originParty }: CustodyTimelineProps) {
  const events = [];

  // Origin / initial registration
  if (originParty) {
    events.push({ type: 'origin', party: originParty, role: 'manufacturer' });
  }

  transfers.forEach((t) => {
    events.push({ type: 'transfer', transfer: t });
  });

  if (events.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-8">No custody history available</p>;
  }

  return (
    <div className="relative">
      {events.map((event, idx) => {
        if (event.type === 'origin') {
          return (
            <div key="origin" className="flex gap-3 mb-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center z-10 relative">
                  <Building2 size={14} className="text-violet-400" />
                </div>
                {events.length > 1 && (
                  <div className="w-px bg-gradient-to-b from-violet-500/40 to-white/05 flex-1 mt-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs font-medium text-violet-400">Origin</p>
                <p className="text-sm font-semibold text-slate-200">{event.party}</p>
                <Badge variant="pending" size="sm" className="mt-1">Manufacturer</Badge>
              </div>
            </div>
          );
        }

        const t = event.transfer!;
        const isLast = idx === events.length - 1;
        const statusColors = {
          completed: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
          pending: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
          accepted: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
          rejected: 'bg-red-500/20 border-red-500/40 text-red-400',
        };

        return (
          <div key={t.id} className="flex gap-3 mb-0">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 relative ${statusColors[t.status]}`}>
                {t.status === 'completed' ? (
                  <CheckCircle2 size={14} />
                ) : t.status === 'pending' ? (
                  <Clock size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
              {!isLast && (
                <div className="w-px bg-gradient-to-b from-white/10 to-white/03 flex-1 mt-1" />
              )}
            </div>
            <div className="pb-6 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs text-slate-500">{formatTimestamp(t.timestamp)}</span>
                <Badge
                  variant={t.status === 'completed' ? 'safe' : t.status === 'pending' ? 'warning' : 'default'}
                  size="sm"
                >
                  {t.status}
                </Badge>
              </div>

              <p className="text-sm font-semibold text-slate-200">{t.toParty}</p>
              <p className="text-xs text-slate-500 capitalize">{ROLE_LABELS[t.toPartyRole]}</p>

              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <Thermometer size={10} />
                  <span>{formatTemp(t.temperature)} at handover</span>
                </div>
                {t.location && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={10} />
                    <span className="truncate">{t.location.label}</span>
                  </div>
                )}
              </div>

              {t.blockchainTxHash && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Link2 size={10} className="text-violet-400" />
                  <a
                    href={`${BLOCKCHAIN_EXPLORER_URL}/tx/${t.blockchainTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-violet-400 hover:text-violet-300 transition-colors"
                    title={t.blockchainTxHash}
                  >
                    {truncateTxHash(t.blockchainTxHash)}
                  </a>
                  <Badge variant="verified" size="sm">✓ On-chain</Badge>
                </div>
              )}

              {t.notes && (
                <p className="mt-1.5 text-xs text-slate-500 italic">&ldquo;{t.notes}&rdquo;</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
