'use client';
import { BlockchainEvent } from '@/types';
import { formatTimestamp, truncateTxHash } from '@/lib/utils';
import { BLOCKCHAIN_EVENT_LABELS, BLOCKCHAIN_EXPLORER_URL } from '@/lib/constants';
import { ShieldCheck, ExternalLink, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface BlockchainProofProps {
  events: BlockchainEvent[];
}

export function BlockchainProof({ events }: BlockchainProofProps) {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        No blockchain events recorded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="glass-card border border-violet-500/15 bg-violet-500/3 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-violet-400" />
              <span className="text-sm font-medium text-slate-200">
                {BLOCKCHAIN_EVENT_LABELS[event.eventType]}
              </span>
            </div>
            <Badge
              variant={event.verificationStatus === 'verified' ? 'verified' : event.verificationStatus === 'pending' ? 'pending' : 'breach'}
              size="sm"
            >
              {event.verificationStatus === 'verified' ? '✓ Verified' : event.verificationStatus === 'pending' ? 'Pending' : 'Failed'}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 shrink-0">Tx Hash</span>
              <a
                href={`${BLOCKCHAIN_EXPLORER_URL}/tx/${event.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                title={event.txHash}
              >
                {truncateTxHash(event.txHash, 12)}
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 flex items-center gap-1 shrink-0"><Hash size={10} />Data Hash</span>
              <span className="font-mono text-slate-500 text-right" title={event.dataHash}>
                {truncateTxHash(event.dataHash, 10)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp</span>
              <span className="text-slate-400">{formatTimestamp(event.timestamp)}</span>
            </div>

            {event.blockNumber && (
              <div className="flex justify-between">
                <span className="text-slate-500">Block</span>
                <span className="font-mono text-slate-400">#{event.blockNumber.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
