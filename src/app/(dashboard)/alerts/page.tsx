'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAlerts, acknowledgeAlert } from '@/lib/services/api';
import { useAuth } from '@/lib/auth/context';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ALERT_TYPE_LABELS, ALERT_SEVERITY_LABELS } from '@/lib/constants';
import { formatRelative, formatTimestamp, cn, ALERT_SEVERITY_COLORS } from '@/lib/utils';
import { Bell, Check, Filter, AlertTriangle, WifiOff, Clock, Shield, Package } from 'lucide-react';
import Link from 'next/link';
import { AlertType, AlertSeverity } from '@/types';
import { useToast } from '@/components/ui/Toast';

const ALERT_ICONS: Record<string, React.ReactNode> = {
  temperature_breach: <AlertTriangle size={16} />,
  sensor_offline: <WifiOff size={16} />,
  delayed_sync: <Clock size={16} />,
  high_risk: <Shield size={16} />,
  custody_pending: <Package size={16} />,
  delivery_delayed: <Clock size={16} />,
};

export default function AlertsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<string>('');

  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['alerts-all', severityFilter, typeFilter, acknowledgedFilter],
    queryFn: () => getAlerts({
      severity: severityFilter as AlertSeverity || undefined,
      type: typeFilter as AlertType || undefined,
      acknowledged: acknowledgedFilter === '' ? undefined : acknowledgedFilter === 'yes',
    }),
    refetchInterval: 15000,
  });

  const handleAcknowledge = async (alertId: string) => {
    if (!user) return;
    await acknowledgeAlert(alertId, user.name);
    queryClient.invalidateQueries({ queryKey: ['alerts-all'] });
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
    toast('success', 'Alert acknowledged');
  };

  const unackCount = alerts?.filter((a) => !a.isAcknowledged).length ?? 0;

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-100">Alert Center</h1>
          {unackCount > 0 && (
            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full breach-pulse">
              {unackCount} active
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={14} className="text-slate-500" />
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-slate-800/50 border border-white/07 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-800/50 border border-white/07 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="temperature_breach">Temperature Breach</option>
          <option value="sensor_offline">Sensor Offline</option>
          <option value="delayed_sync">Delayed Sync</option>
          <option value="custody_pending">Custody Pending</option>
        </select>
        <select
          value={acknowledgedFilter}
          onChange={(e) => setAcknowledgedFilter(e.target.value)}
          className="bg-slate-800/50 border border-white/07 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="">All Alerts</option>
          <option value="no">Active (unacknowledged)</option>
          <option value="yes">Acknowledged</option>
        </select>
        <span className="ml-auto text-xs text-slate-500">{alerts?.length ?? 0} alerts</span>
      </div>

      {isLoading ? (
        <LoadingState message="Loading alerts…" />
      ) : error ? (
        <ErrorState message="Failed to load alerts" />
      ) : !alerts?.length ? (
        <EmptyState icon={<Bell size={32} />} title="No alerts" message="Everything looks good!" />
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'glass-card border p-4 rounded-xl transition-all',
                alert.isAcknowledged ? 'opacity-60 border-white/05' :
                alert.severity === 'critical' ? 'border-red-500/30 bg-red-500/3' :
                alert.severity === 'warning' ? 'border-amber-500/20' : 'border-white/07'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                  'mt-0.5 shrink-0',
                  alert.severity === 'critical' ? 'text-red-400' :
                  alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                )}>
                  {ALERT_ICONS[alert.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-slate-200">{alert.title}</p>
                    <Badge
                      variant={alert.severity === 'critical' ? 'breach' : alert.severity === 'warning' ? 'warning' : 'pending'}
                      size="sm"
                    >
                      {ALERT_SEVERITY_LABELS[alert.severity]}
                    </Badge>
                    <Badge variant="default" size="sm">{ALERT_TYPE_LABELS[alert.type]}</Badge>
                    {alert.isAcknowledged && <Badge variant="safe" size="sm">✓ Acknowledged</Badge>}
                  </div>
                  <p className="text-sm text-slate-400">{alert.message}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{formatRelative(alert.timestamp)}</span>
                    <span>·</span>
                    <Link href={`/shipments/${alert.shipmentId}`} className="text-cyan-400 hover:underline">
                      {alert.shipmentId}
                    </Link>
                    {alert.custodian && (
                      <>
                        <span>·</span>
                        <span>{alert.custodian}</span>
                      </>
                    )}
                    {alert.isAcknowledged && alert.acknowledgedBy && (
                      <>
                        <span>·</span>
                        <span>Ack by {alert.acknowledgedBy} {alert.acknowledgedAt && formatRelative(alert.acknowledgedAt)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!alert.isAcknowledged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Check size={12} />}
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
