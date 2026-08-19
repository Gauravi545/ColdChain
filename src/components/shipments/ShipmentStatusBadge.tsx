'use client';
import { ShipmentStatus, TemperatureCondition, SensorConnectionStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { SHIPMENT_STATUS_LABELS, TEMPERATURE_CONDITION_LABELS, SENSOR_STATUS_LABELS } from '@/lib/constants';

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  const variantMap: Record<ShipmentStatus, 'default' | 'safe' | 'warning' | 'breach' | 'offline' | 'pending'> = {
    registered: 'pending',
    in_transit: 'default',
    at_distributor: 'default',
    delivered: 'safe',
    on_hold: 'warning',
    recalled: 'breach',
  };
  return (
    <Badge variant={variantMap[status]} dot>
      {SHIPMENT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function TemperatureBadge({ condition, value }: { condition: TemperatureCondition; value?: number }) {
  const variantMap: Record<TemperatureCondition, 'safe' | 'warning' | 'breach'> = {
    safe: 'safe',
    warning: 'warning',
    breach: 'breach',
  };
  return (
    <Badge variant={variantMap[condition]} dot>
      {value !== undefined ? `${value.toFixed(1)}°C — ` : ''}{TEMPERATURE_CONDITION_LABELS[condition]}
    </Badge>
  );
}

export function SensorStatusBadge({ status }: { status: SensorConnectionStatus }) {
  const variantMap: Record<SensorConnectionStatus, 'safe' | 'breach' | 'warning'> = {
    online: 'safe',
    offline: 'breach',
    syncing: 'warning',
  };
  return (
    <Badge variant={variantMap[status]} dot>
      {SENSOR_STATUS_LABELS[status]}
    </Badge>
  );
}
