import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import {
  TemperatureCondition,
  ShipmentStatus,
  SensorConnectionStatus,
  BreachSeverity,
  AlertSeverity,
} from '@/types';

// ----------------------------------------------------------
// TAILWIND CLASS MERGING
// ----------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------
// DATE FORMATTING
// ----------------------------------------------------------

export function formatTimestamp(ts: string): string {
  try {
    return format(new Date(ts), 'dd MMM yyyy, HH:mm');
  } catch {
    return ts;
  }
}

export function formatTime(ts: string): string {
  try {
    return format(new Date(ts), 'HH:mm');
  } catch {
    return ts;
  }
}

export function formatRelative(ts: string): string {
  try {
    return formatDistanceToNow(new Date(ts), { addSuffix: true });
  } catch {
    return ts;
  }
}

export function formatDate(ts: string): string {
  try {
    return format(new Date(ts), 'dd MMM yyyy');
  } catch {
    return ts;
  }
}

// ----------------------------------------------------------
// TEMPERATURE FORMATTING
// ----------------------------------------------------------

export function formatTemp(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function getTemperatureCondition(
  temp: number,
  min: number,
  max: number
): TemperatureCondition {
  if (temp < min || temp > max) return 'breach';
  const buffer = (max - min) * 0.1;
  if (temp < min + buffer || temp > max - buffer) return 'warning';
  return 'safe';
}

// ----------------------------------------------------------
// STATUS COLORS (Tailwind classes)
// ----------------------------------------------------------

export const TEMP_CONDITION_COLORS: Record<TemperatureCondition, string> = {
  safe: 'text-emerald-400',
  warning: 'text-amber-400',
  breach: 'text-red-400',
};

export const TEMP_CONDITION_BG: Record<TemperatureCondition, string> = {
  safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  breach: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const SHIPMENT_STATUS_COLORS: Record<ShipmentStatus, string> = {
  registered: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_transit: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  at_distributor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  recalled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const SENSOR_STATUS_COLORS: Record<SensorConnectionStatus, string> = {
  online: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  offline: 'bg-red-500/10 text-red-400 border-red-500/20',
  syncing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export const BREACH_SEVERITY_COLORS: Record<BreachSeverity, string> = {
  low: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  critical: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
};

export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, string> = {
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// ----------------------------------------------------------
// MISC UTILITIES
// ----------------------------------------------------------

export function truncateTxHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural ?? singular + 's'}`;
}

export function generateShipmentQRUrl(shipmentId: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${base}/verify/${shipmentId}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
