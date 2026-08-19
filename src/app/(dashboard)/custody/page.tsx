'use client';
import { useQuery } from '@tanstack/react-query';
import { getCustodyHistory, getShipments } from '@/lib/services/api';
import { useAuth } from '@/lib/auth/context';
import { LoadingState, EmptyState } from '@/components/ui/States';
import { CustodyTimeline } from '@/components/custody/CustodyTimeline';
import { GitBranch, Package } from 'lucide-react';
import Link from 'next/link';
import { ShipmentStatusBadge } from '@/components/shipments/ShipmentStatusBadge';
import { useState } from 'react';
import { MOCK_SHIPMENTS } from '@/lib/mock/data';

export default function CustodyPage() {
  const { role } = useAuth();
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['shipments', role],
    queryFn: () => getShipments({}, role ?? undefined),
  });

  const { data: custody } = useQuery({
    queryKey: ['custody', selectedShipment],
    queryFn: () => getCustodyHistory(selectedShipment!),
    enabled: !!selectedShipment,
  });

  const selected = shipments?.find((s) => s.id === selectedShipment);

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Chain of Custody</h1>
        <p className="text-sm text-slate-500 mt-0.5">Select a shipment to view full custody history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Shipment list */}
        <div className="lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Shipments</h2>
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-2">
              {(shipments ?? []).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShipment(s.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedShipment === s.id ? 'border-cyan-500/40 bg-cyan-500/5' : 'glass-card border-white/07 hover:border-white/15'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-cyan-400">{s.id}</span>
                    <ShipmentStatusBadge status={s.status} />
                  </div>
                  <p className="text-sm font-medium text-slate-200 truncate">{s.product}</p>
                  <p className="text-xs text-slate-500">{s.currentCustodian}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          {!selectedShipment ? (
            <div className="glass-card border border-white/07 flex items-center justify-center h-64">
              <EmptyState icon={<GitBranch size={32} />} title="Select a shipment" message="Choose a shipment to view its full custody chain" />
            </div>
          ) : (
            <div className="glass-card border border-white/07 p-5">
              <div className="flex items-center gap-2 mb-5">
                <GitBranch size={16} className="text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-200">Custody Timeline — {selectedShipment}</h2>
                <Link href={`/shipments/${selectedShipment}`} className="ml-auto text-xs text-cyan-400 hover:underline">
                  View shipment →
                </Link>
              </div>
              <CustodyTimeline
                transfers={custody ?? []}
                originParty={selected?.origin.label.split(',')[0]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
