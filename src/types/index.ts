// ============================================================
// CENTRALIZED TYPE DEFINITIONS
// ColdChain Provenance & Accountability Platform
// ============================================================

// ----------------------------------------------------------
// USERS & ROLES
// ----------------------------------------------------------

export type UserRole =
  | 'admin'
  | 'manufacturer'
  | 'transporter'
  | 'distributor'
  | 'retailer'
  | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  isActive: boolean;
}

// ----------------------------------------------------------
// SHIPMENT CORE
// ----------------------------------------------------------

export type ShipmentStatus =
  | 'registered'
  | 'in_transit'
  | 'at_distributor'
  | 'delivered'
  | 'on_hold'
  | 'recalled';

export type TemperatureCondition = 'safe' | 'warning' | 'breach';

export type SensorConnectionStatus = 'online' | 'offline' | 'syncing';

export interface SafeTemperatureRange {
  min: number;
  max: number;
  unit: 'C' | 'F';
}

export interface LocationPoint {
  lat: number;
  lng: number;
  label?: string;
  timestamp: string;
  address?: string;
}

export interface Shipment {
  id: string;
  product: string;
  productType: string;
  batchNumber: string;
  origin: LocationPoint;
  destination: LocationPoint;
  safeTemperatureRange: SafeTemperatureRange;
  currentTemperature: number;
  currentHumidity?: number;
  temperatureCondition: TemperatureCondition;
  currentCustodian: string;
  currentCustodianRole: UserRole;
  currentLocation: LocationPoint;
  status: ShipmentStatus;
  sensorStatus: SensorConnectionStatus;
  sensorId: string;
  createdAt: string;
  estimatedDelivery: string;
  hasActiveBreach: boolean;
  blockchainVerified: boolean;
  qrCode?: string;
}

// ----------------------------------------------------------
// TEMPERATURE READINGS
// ----------------------------------------------------------

export interface TemperatureReading {
  id: string;
  shipmentId: string;
  sensorId: string;
  temperature: number;
  humidity?: number;
  timestamp: string;
  receivedAt: string;         // when backend actually received it
  isOfflineSynced: boolean;   // true = was stored-and-forwarded
  isBreach: boolean;
  location?: LocationPoint;
}

// ----------------------------------------------------------
// SENSOR STATUS
// ----------------------------------------------------------

export interface SensorStatus {
  sensorId: string;
  shipmentId: string;
  status: SensorConnectionStatus;
  lastSync: string;
  lastReading: string;
  pendingReadings: number;
  offlineDurationMinutes?: number;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
}

// ----------------------------------------------------------
// CUSTODY TRANSFERS
// ----------------------------------------------------------

export type CustodyStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface CustodyTransfer {
  id: string;
  shipmentId: string;
  fromParty: string;
  fromPartyRole: UserRole;
  toParty: string;
  toPartyRole: UserRole;
  timestamp: string;
  location: LocationPoint;
  temperature: number;
  status: CustodyStatus;
  blockchainTxHash?: string;
  notes?: string;
  signature?: string;
}

// ----------------------------------------------------------
// BREACH EVENTS
// ----------------------------------------------------------

export type BreachSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BreachEvent {
  id: string;
  shipmentId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  maxTemperature: number;
  allowedMax: number;
  allowedMin: number;
  severity: BreachSeverity;
  responsibleCustodian: string;
  responsibleCustodianRole: UserRole;
  custodyWindowStart: string;
  custodyWindowEnd?: string;
  location?: LocationPoint;
  blockchainTxHash?: string;
  isResolved: boolean;
  sensorId: string;
}

// ----------------------------------------------------------
// BLOCKCHAIN EVENTS
// ----------------------------------------------------------

export type BlockchainEventType =
  | 'SHIPMENT_REGISTERED'
  | 'CUSTODY_TRANSFERRED'
  | 'TEMPERATURE_BREACH'
  | 'SENSOR_CALIBRATED'
  | 'DELIVERY_CONFIRMED'
  | 'RECALL_INITIATED'
  | 'INCIDENT_RECORDED';

export interface BlockchainEvent {
  id: string;
  shipmentId: string;
  eventType: BlockchainEventType;
  txHash: string;
  dataHash: string;
  timestamp: string;
  blockNumber?: number;
  networkId?: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
  metadata?: Record<string, unknown>;
}

// ----------------------------------------------------------
// ALERTS
// ----------------------------------------------------------

export type AlertType =
  | 'temperature_breach'
  | 'sensor_offline'
  | 'delayed_sync'
  | 'high_risk'
  | 'custody_pending'
  | 'delivery_delayed';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  shipmentId: string;
  shipmentName?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  custodian?: string;
  metadata?: Record<string, unknown>;
}

// ----------------------------------------------------------
// INCIDENT REPORTS
// ----------------------------------------------------------

export interface IncidentReport {
  id: string;
  shipmentId: string;
  generatedAt: string;
  generatedBy: string;
  product: string;
  batchNumber: string;
  safeTemperatureRange: SafeTemperatureRange;
  breach: BreachEvent;
  sensor: SensorStatus;
  blockchainEvents: BlockchainEvent[];
  custodyDuringBreach: CustodyTransfer;
  dataIntegrityVerified: boolean;
  reportUrl?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'closed';
}

// ----------------------------------------------------------
// REALTIME WEBSOCKET EVENTS
// ----------------------------------------------------------

export type WSEventType =
  | 'TEMPERATURE_UPDATE'
  | 'TEMPERATURE_BREACH'
  | 'SENSOR_OFFLINE'
  | 'SENSOR_RECONNECTED'
  | 'CUSTODY_UPDATED'
  | 'LOCATION_UPDATE'
  | 'DELAYED_SYNC'
  | 'DATA_SYNCED'
  | 'ALERT_NEW';

export interface WSEvent<T = unknown> {
  type: WSEventType;
  shipmentId: string;
  timestamp: string;
  payload: T;
}

export interface WSTemperaturePayload {
  temperature: number;
  humidity?: number;
  sensorId: string;
  condition: TemperatureCondition;
}

export interface WSBreachPayload extends WSTemperaturePayload {
  breach: BreachEvent;
}

export interface WSSensorPayload {
  sensorId: string;
  status: SensorConnectionStatus;
  pendingReadings?: number;
  offlineDurationMinutes?: number;
}

export interface WSLocationPayload {
  location: LocationPoint;
}

export interface WSCustodyPayload {
  transfer: CustodyTransfer;
}

export interface WSDataSyncedPayload {
  sensorId: string;
  readingsCount: number;
  startTime: string;
  endTime: string;
  receivedAt: string;
  integrityVerified: boolean;
}

// ----------------------------------------------------------
// API RESPONSES
// ----------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ----------------------------------------------------------
// FILTER TYPES
// ----------------------------------------------------------

export interface ShipmentFilters {
  status?: ShipmentStatus;
  product?: string;
  custodian?: string;
  location?: string;
  temperatureCondition?: TemperatureCondition;
  hasBreach?: boolean;
  search?: string;
}

export interface AlertFilters {
  severity?: AlertSeverity;
  type?: AlertType;
  shipmentId?: string;
  acknowledged?: boolean;
}

// ----------------------------------------------------------
// DASHBOARD KPIs
// ----------------------------------------------------------

export interface DashboardKPIs {
  totalActiveShipments: number;
  safeShipments: number;
  temperatureBreaches: number;
  offlineSensors: number;
  pendingCustodyTransfers: number;
  deliveredToday: number;
}
