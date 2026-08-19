import {
  UserRole,
  ShipmentStatus,
  TemperatureCondition,
  SensorConnectionStatus,
  BreachSeverity,
  AlertType,
  AlertSeverity,
  BlockchainEventType,
} from '@/types';

// ----------------------------------------------------------
// STATUS LABELS
// ----------------------------------------------------------

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  registered: 'Registered',
  in_transit: 'In Transit',
  at_distributor: 'At Distributor',
  delivered: 'Delivered',
  on_hold: 'On Hold',
  recalled: 'Recalled',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  manufacturer: 'Manufacturer',
  transporter: 'Transporter',
  distributor: 'Distributor',
  retailer: 'Retailer',
  public: 'Public',
};

export const TEMPERATURE_CONDITION_LABELS: Record<TemperatureCondition, string> = {
  safe: 'Safe',
  warning: 'Warning',
  breach: 'Breach',
};

export const SENSOR_STATUS_LABELS: Record<SensorConnectionStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  syncing: 'Syncing',
};

export const BREACH_SEVERITY_LABELS: Record<BreachSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  temperature_breach: 'Temperature Breach',
  sensor_offline: 'Sensor Offline',
  delayed_sync: 'Delayed Sync',
  high_risk: 'High Risk',
  custody_pending: 'Custody Pending',
  delivery_delayed: 'Delivery Delayed',
};

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
};

export const BLOCKCHAIN_EVENT_LABELS: Record<BlockchainEventType, string> = {
  SHIPMENT_REGISTERED: 'Shipment Registered',
  CUSTODY_TRANSFERRED: 'Custody Transferred',
  TEMPERATURE_BREACH: 'Temperature Breach',
  SENSOR_CALIBRATED: 'Sensor Calibrated',
  DELIVERY_CONFIRMED: 'Delivery Confirmed',
  RECALL_INITIATED: 'Recall Initiated',
  INCIDENT_RECORDED: 'Incident Recorded',
};

// ----------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', roles: ['admin', 'manufacturer', 'transporter', 'distributor', 'retailer'] },
  { label: 'Shipments', href: '/shipments', icon: 'Package', roles: ['admin', 'manufacturer', 'transporter', 'distributor', 'retailer'] },
  { label: 'Alerts', href: '/alerts', icon: 'Bell', roles: ['admin', 'manufacturer', 'transporter', 'distributor', 'retailer'] },
  { label: 'Custody', href: '/custody', icon: 'GitBranch', roles: ['admin', 'manufacturer', 'transporter', 'distributor', 'retailer'] },
  { label: 'Reports', href: '/reports', icon: 'FileText', roles: ['admin', 'manufacturer', 'distributor', 'retailer'] },
  { label: 'Users', href: '/admin/users', icon: 'Users', roles: ['admin'] },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings', roles: ['admin'] },
] as const;

// ----------------------------------------------------------
// ENV CONFIG
// ----------------------------------------------------------

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
export const BLOCKCHAIN_EXPLORER_URL =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL || 'https://explorer.example.com';
