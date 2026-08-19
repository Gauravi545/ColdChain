'use client';
import { SensorStatus } from '@/types';
import { formatRelative, formatTimestamp } from '@/lib/utils';
import { SensorStatusBadge } from '@/components/shipments/ShipmentStatusBadge';
import { Wifi, WifiOff, RefreshCw, Battery, Signal, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorStatusCardProps {
  sensor: SensorStatus;
  syncData?: {
    readingsCount: number;
    startTime: string;
    endTime: string;
    receivedAt: string;
    integrityVerified: boolean;
  };
}

export function SensorStatusCard({ sensor, syncData }: SensorStatusCardProps) {
  const isOffline = sensor.status === 'offline';
  const isSyncing = sensor.status === 'syncing';

  return (
    <div className={cn(
      'glass-card border p-5',
      isOffline ? 'border-red-500/20' : isSyncing ? 'border-amber-500/20' : 'border-emerald-500/20'
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <WifiOff size={16} className="text-red-400" />
          ) : isSyncing ? (
            <RefreshCw size={16} className="text-amber-400 animate-spin" />
          ) : (
            <Wifi size={16} className="text-emerald-400" />
          )}
          <span className="text-sm font-semibold text-slate-200">Sensor Status</span>
        </div>
        <SensorStatusBadge status={sensor.status} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Sensor ID</span>
          <span className="font-mono text-cyan-400">{sensor.sensorId}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1"><Clock size={11} />Last Sync</span>
          <span className="text-slate-300">{formatTimestamp(sensor.lastSync)}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Last Reading</span>
          <span className="text-slate-300">{formatRelative(sensor.lastReading)}</span>
        </div>

        {isOffline && (
          <>
            <div className="border-t border-white/05 pt-3 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">OFFLINE</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Offline duration</span>
                  <span className="text-red-400 font-medium">{sensor.offlineDurationMinutes} min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><Database size={11} />Pending readings</span>
                  <span className="text-amber-400 font-semibold">{sensor.pendingReadings}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {syncData && (
          <div className="border-t border-white/05 pt-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={14} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">
                {syncData.readingsCount} readings synchronized
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded</span>
                <span className="text-slate-300">{formatTimestamp(syncData.startTime)} – {formatTimestamp(syncData.endTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Received at</span>
                <span className="text-slate-300">{formatTimestamp(syncData.receivedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Integrity</span>
                <span className={syncData.integrityVerified ? 'text-emerald-400' : 'text-red-400'}>
                  {syncData.integrityVerified ? '✓ Verified' : '✗ Failed'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hardware info */}
        <div className="border-t border-white/05 pt-3 mt-3 flex items-center justify-between">
          {sensor.batteryLevel !== undefined && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Battery size={12} />
              <span>{sensor.batteryLevel}%</span>
            </div>
          )}
          {sensor.signalStrength !== undefined && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Signal size={12} />
              <span>{sensor.signalStrength} dBm</span>
            </div>
          )}
          {sensor.firmwareVersion && (
            <span className="text-xs text-slate-600">FW {sensor.firmwareVersion}</span>
          )}
        </div>
      </div>
    </div>
  );
}
