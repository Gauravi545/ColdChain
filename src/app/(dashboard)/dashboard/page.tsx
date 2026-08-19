'use client';
import { useAuth } from '@/lib/auth/context';
import { useQuery } from '@tanstack/react-query';
import { getDashboardKPIs, getShipments, getAlerts } from '@/lib/services/api';
import { StatCard } from '@/components/ui/StatCard';
import { ShipmentTable } from '@/components/shipments/ShipmentTable';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { Package, ShieldCheck, AlertTriangle, WifiOff, Clock, Truck } from 'lucide-react';
import { ROLE_LABELS } from '@/lib/constants';
import { formatRelative, formatTemp, cn } from '@/lib/utils';
import Link from 'next/link';
import { ALERT_TYPE_LABELS, ALERT_SEVERITY_LABELS } from '@/lib/constants';

// Role-specific welcome messages
const ROLE_SUBTITLES: Record<string, string> = {
  admin: 'Platform-wide overview across all shipments and custodians.',
  manufacturer: 'Monitor your registered shipments and pending handovers.',
  transporter: 'View your active shipments and sensor statuses.',
  distributor: 'Track incoming and outgoing shipments, investigate breaches.',
  retailer: 'View incoming shipments and verify temperature compliance.',
};

export default function DashboardPage() {
  const { user, role } = useAuth();

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: getDashboardKPIs,
    refetchInterval: 30000,
  });

  const { data: shipments, isLoading: shipmentsLoading, error } = useQuery({
    queryKey: ['shipments', role],
    queryFn: () => getShipments({}, role ?? undefined),
    refetchInterval: 15000,
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getAlerts({ acknowledged: false }),
    refetchInterval: 20000,
  });

  const activeAlerts = alerts?.slice(0, 4) ?? [];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {role ? ROLE_SUBTITLES[role] : ''} &nbsp;·&nbsp;
          <span className="text-slate-600">{role ? ROLE_LABELS[role] : ''} · {user?.organization}</span>
        </p>
      </div>

      {/* KPI Cards */}
      {kpisLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-28 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Shipments"
            value={kpis.totalActiveShipments}
            icon={Package}
            color="cyan"
            subtitle={`${kpis.pendingCustodyTransfers} pending transfers`}
          />
          <StatCard
            label="Safe Shipments"
            value={kpis.safeShipments}
            icon={ShieldCheck}
            color="emerald"
            subtitle="Within safe temp range"
          />
          <StatCard
            label="Active Breaches"
            value={kpis.temperatureBreaches}
            icon={AlertTriangle}
            color="red"
            pulse={kpis.temperatureBreaches > 0}
            subtitle="Require immediate action"
          />
          <StatCard
            label="Offline Sensors"
            value={kpis.offlineSensors}
            icon={WifiOff}
            color="amber"
            subtitle="Pending data sync"
          />
        </div>
      ) : null}

      {/* Alerts + Shipment table row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="xl:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">Active Alerts</h2>
            <Link href="/alerts" className="text-xs text-cyan-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {activeAlerts.length === 0 ? (
              <div className="glass-card border border-emerald-500/20 p-4 text-center">
                <p className="text-sm text-emerald-400">✓ No active alerts</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'glass-card border p-3 rounded-xl',
                    alert.severity === 'critical' ? 'border-red-500/30 bg-red-500/3' :
                    alert.severity === 'warning' ? 'border-amber-500/20' : 'border-white/07'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full mt-1.5 shrink-0',
                      alert.severity === 'critical' ? 'bg-red-400 breach-pulse' :
                      alert.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                    )} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{alert.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-600">{formatRelative(alert.timestamp)}</span>
                        <Link
                          href={`/shipments/${alert.shipmentId}`}
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          {alert.shipmentId}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shipment table */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">
              {role === 'admin' ? 'All Shipments' : 'Your Shipments'}
            </h2>
            <Link href="/shipments" className="text-xs text-cyan-400 hover:underline">View all</Link>
          </div>
          {shipmentsLoading ? (
            <LoadingState message="Loading shipments…" />
          ) : error ? (
            <ErrorState message="Failed to load shipments" />
          ) : (
            <ShipmentTable shipments={shipments ?? []} showFilters={false} />
          )}
        </div>
      </div>

      {/* Role-specific panels */}
      {role === 'manufacturer' && (
        <ManufacturerPanel shipments={shipments ?? []} />
      )}
      {role === 'transporter' && (
        <TransporterPanel shipments={shipments ?? []} />
      )}
    </div>
  );
}

function ManufacturerPanel({ shipments }: { shipments: ReturnType<typeof Array<any>> }) {
  const registered = shipments.filter((s: any) => s.status === 'registered');
  return (
    <div className="glass-card border border-white/07 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Truck size={16} className="text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Ready for Pickup</h3>
        {registered.length > 0 && (
          <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {registered.length} awaiting transporter
          </span>
        )}
      </div>
      {registered.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No shipments awaiting pickup</p>
      ) : (
        <div className="space-y-2">
          {registered.map((s: any) => (
            <Link key={s.id} href={`/shipments/${s.id}`} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-200">{s.id}</p>
                <p className="text-xs text-slate-500">{s.product}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-cyan-400">{formatTemp(s.currentTemperature)}</p>
                <p className="text-xs text-slate-600">{s.currentLocation.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TransporterPanel({ shipments }: { shipments: ReturnType<typeof Array<any>> }) {
  const active = shipments.filter((s: any) => s.status === 'in_transit');
  return (
    <div className="glass-card border border-white/07 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-amber-400" />
        <h3 className="text-sm font-semibold text-slate-200">Active Transit</h3>
        <span className="ml-auto text-xs text-slate-500">{active.length} shipments</span>
      </div>
      <div className="space-y-2">
        {active.map((s: any) => (
          <Link key={s.id} href={`/shipments/${s.id}`} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-200">{s.id} — {s.product}</p>
              <p className="text-xs text-slate-500">{s.currentLocation.label}</p>
            </div>
            <div className={cn('text-sm font-bold font-mono', s.temperatureCondition === 'breach' ? 'text-red-400' : 'text-emerald-400')}>
              {formatTemp(s.currentTemperature)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
