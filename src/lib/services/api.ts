import { sleep } from '@/lib/utils';
import {
  MOCK_SHIPMENTS,
  MOCK_TEMPERATURE_READINGS,
  MOCK_SENSOR_STATUSES,
  MOCK_CUSTODY_TRANSFERS,
  MOCK_BREACH_EVENTS,
  MOCK_BLOCKCHAIN_EVENTS,
  MOCK_ALERTS,
  MOCK_DASHBOARD_KPIS,
  MOCK_ROUTE_HISTORY,
  MOCK_USERS,
} from '@/lib/mock/data';
import {
  Shipment,
  TemperatureReading,
  SensorStatus,
  CustodyTransfer,
  BreachEvent,
  BlockchainEvent,
  Alert,
  IncidentReport,
  User,
  ShipmentFilters,
  AlertFilters,
  DashboardKPIs,
  UserRole,
} from '@/types';

// ----------------------------------------------------------
// API CLIENT — Replace MOCK_* with real fetch() calls later
// All API calls should use NEXT_PUBLIC_API_URL from env
// ----------------------------------------------------------

const ARTIFICIAL_DELAY = 400; // ms — simulates network latency

// ----------------------------------------------------------
// SHIPMENTS
// ----------------------------------------------------------

export async function getShipments(
  filters?: ShipmentFilters,
  role?: UserRole
): Promise<Shipment[]> {
  await sleep(ARTIFICIAL_DELAY);
  let shipments = [...MOCK_SHIPMENTS];

  // Role-based filtering
  if (role === 'transporter') {
    shipments = shipments.filter((s) => s.currentCustodianRole === 'transporter' || s.status === 'registered');
  } else if (role === 'distributor') {
    shipments = shipments.filter((s) =>
      s.currentCustodianRole === 'distributor' || s.status === 'in_transit'
    );
  } else if (role === 'retailer') {
    shipments = shipments.filter((s) =>
      s.currentCustodianRole === 'retailer' || s.status === 'at_distributor'
    );
  } else if (role === 'manufacturer') {
    // Manufacturers see all their registered shipments
    shipments = shipments.filter((s) => s.currentCustodianRole === 'manufacturer' || true);
  }

  // Apply user filters
  if (filters?.status) shipments = shipments.filter((s) => s.status === filters.status);
  if (filters?.product) shipments = shipments.filter((s) => s.product.toLowerCase().includes(filters.product!.toLowerCase()));
  if (filters?.custodian) shipments = shipments.filter((s) => s.currentCustodian.toLowerCase().includes(filters.custodian!.toLowerCase()));
  if (filters?.temperatureCondition) shipments = shipments.filter((s) => s.temperatureCondition === filters.temperatureCondition);
  if (filters?.hasBreach !== undefined) shipments = shipments.filter((s) => s.hasActiveBreach === filters.hasBreach);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    shipments = shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.product.toLowerCase().includes(q) ||
        s.currentCustodian.toLowerCase().includes(q)
    );
  }

  return shipments;
}

export async function getShipment(id: string): Promise<Shipment | null> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_SHIPMENTS.find((s) => s.id === id) ?? null;
}

// ----------------------------------------------------------
// TEMPERATURE HISTORY
// ----------------------------------------------------------

export async function getTemperatureHistory(shipmentId: string): Promise<TemperatureReading[]> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_TEMPERATURE_READINGS[shipmentId] ?? [];
}

// ----------------------------------------------------------
// SENSOR STATUS
// ----------------------------------------------------------

export async function getSensorStatus(shipmentId: string): Promise<SensorStatus | null> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_SENSOR_STATUSES[shipmentId] ?? null;
}

// ----------------------------------------------------------
// CUSTODY HISTORY
// ----------------------------------------------------------

export async function getCustodyHistory(shipmentId: string): Promise<CustodyTransfer[]> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_CUSTODY_TRANSFERS[shipmentId] ?? [];
}

export async function transferCustody(
  shipmentId: string,
  toParty: string,
  toPartyRole: UserRole,
  temperature: number,
  notes?: string
): Promise<CustodyTransfer> {
  await sleep(800);
  const shipment = MOCK_SHIPMENTS.find((s) => s.id === shipmentId);
  if (!shipment) throw new Error('Shipment not found');

  const transfer: CustodyTransfer = {
    id: `cust-${shipmentId}-${Date.now()}`,
    shipmentId,
    fromParty: shipment.currentCustodian,
    fromPartyRole: shipment.currentCustodianRole,
    toParty,
    toPartyRole,
    timestamp: new Date().toISOString(),
    location: shipment.currentLocation,
    temperature,
    status: 'completed',
    blockchainTxHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
    notes,
  };

  // Mutate mock state
  shipment.currentCustodian = toParty;
  shipment.currentCustodianRole = toPartyRole;
  if (!MOCK_CUSTODY_TRANSFERS[shipmentId]) MOCK_CUSTODY_TRANSFERS[shipmentId] = [];
  MOCK_CUSTODY_TRANSFERS[shipmentId].push(transfer);

  // Add blockchain event
  const bcEvent: BlockchainEvent = {
    id: `bc-${shipmentId}-${Date.now()}`,
    shipmentId,
    eventType: 'CUSTODY_TRANSFERRED',
    txHash: transfer.blockchainTxHash!,
    dataHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
    timestamp: transfer.timestamp,
    blockNumber: 18430000 + Math.floor(Math.random() * 10000),
    verificationStatus: 'verified',
  };
  if (!MOCK_BLOCKCHAIN_EVENTS[shipmentId]) MOCK_BLOCKCHAIN_EVENTS[shipmentId] = [];
  MOCK_BLOCKCHAIN_EVENTS[shipmentId].push(bcEvent);

  return transfer;
}

// ----------------------------------------------------------
// BREACH EVENTS
// ----------------------------------------------------------

export async function getBreachEvents(shipmentId: string): Promise<BreachEvent[]> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_BREACH_EVENTS[shipmentId] ?? [];
}

// ----------------------------------------------------------
// BLOCKCHAIN
// ----------------------------------------------------------

export async function getBlockchainHistory(shipmentId: string): Promise<BlockchainEvent[]> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_BLOCKCHAIN_EVENTS[shipmentId] ?? [];
}

// ----------------------------------------------------------
// ALERTS
// ----------------------------------------------------------

export async function getAlerts(filters?: AlertFilters): Promise<Alert[]> {
  await sleep(ARTIFICIAL_DELAY);
  let alerts = [...MOCK_ALERTS].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  if (filters?.severity) alerts = alerts.filter((a) => a.severity === filters.severity);
  if (filters?.type) alerts = alerts.filter((a) => a.type === filters.type);
  if (filters?.shipmentId) alerts = alerts.filter((a) => a.shipmentId === filters.shipmentId);
  if (filters?.acknowledged !== undefined) alerts = alerts.filter((a) => a.isAcknowledged === filters.acknowledged);
  return alerts;
}

export async function acknowledgeAlert(alertId: string, userName: string): Promise<void> {
  await sleep(300);
  const alert = MOCK_ALERTS.find((a) => a.id === alertId);
  if (alert) {
    alert.isAcknowledged = true;
    alert.acknowledgedBy = userName;
    alert.acknowledgedAt = new Date().toISOString();
  }
}

// ----------------------------------------------------------
// REPORTS
// ----------------------------------------------------------

export async function generateIncidentReport(shipmentId: string, userId: string): Promise<IncidentReport> {
  await sleep(1200);
  const shipment = MOCK_SHIPMENTS.find((s) => s.id === shipmentId);
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!shipment) throw new Error('Shipment not found');

  const breaches = MOCK_BREACH_EVENTS[shipmentId] ?? [];
  const sensor = MOCK_SENSOR_STATUSES[shipmentId];
  const bcEvents = MOCK_BLOCKCHAIN_EVENTS[shipmentId] ?? [];
  const custody = MOCK_CUSTODY_TRANSFERS[shipmentId] ?? [];

  if (breaches.length === 0) throw new Error('No breach events found for this shipment');

  const report: IncidentReport = {
    id: `rpt-${shipmentId}-${Date.now()}`,
    shipmentId,
    generatedAt: new Date().toISOString(),
    generatedBy: user?.name ?? userId,
    product: shipment.product,
    batchNumber: shipment.batchNumber,
    safeTemperatureRange: shipment.safeTemperatureRange,
    breach: breaches[0],
    sensor: sensor!,
    blockchainEvents: bcEvents,
    custodyDuringBreach: custody.find((c) => c.fromParty === breaches[0].responsibleCustodian) ?? custody[0],
    dataIntegrityVerified: true,
    status: 'submitted',
  };

  return report;
}

// ----------------------------------------------------------
// DASHBOARD
// ----------------------------------------------------------

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_DASHBOARD_KPIS;
}

// ----------------------------------------------------------
// USERS (Admin only)
// ----------------------------------------------------------

export async function getUsers(): Promise<User[]> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_USERS;
}

export async function getUser(id: string): Promise<User | null> {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_USERS.find((u) => u.id === id) ?? null;
}

// ----------------------------------------------------------
// ROUTE HISTORY
// ----------------------------------------------------------

export async function getRouteHistory(shipmentId: string) {
  await sleep(ARTIFICIAL_DELAY);
  return MOCK_ROUTE_HISTORY[shipmentId] ?? [];
}

// ----------------------------------------------------------
// PUBLIC VERIFICATION
// ----------------------------------------------------------

export async function getPublicShipmentVerification(shipmentId: string) {
  await sleep(ARTIFICIAL_DELAY);
  const shipment = MOCK_SHIPMENTS.find((s) => s.id === shipmentId);
  if (!shipment) return null;

  const custody = MOCK_CUSTODY_TRANSFERS[shipmentId] ?? [];
  const bc = MOCK_BLOCKCHAIN_EVENTS[shipmentId] ?? [];
  const breaches = MOCK_BREACH_EVENTS[shipmentId] ?? [];

  return {
    shipmentId: shipment.id,
    product: shipment.product,
    productType: shipment.productType,
    batchNumber: shipment.batchNumber,
    manufacturer: custody[0]?.fromParty ?? 'BioPharm India Ltd.',
    currentCustodian: shipment.currentCustodian,
    status: shipment.status,
    temperatureCompliance: !breaches.some((b) => !b.isResolved),
    chainOfCustodyCount: custody.length + 1,
    blockchainVerified: shipment.blockchainVerified,
    lastBlockchainTx: bc[bc.length - 1]?.txHash,
    safeTemperatureRange: shipment.safeTemperatureRange,
    origin: shipment.origin.label,
    destination: shipment.destination.label,
    createdAt: shipment.createdAt,
    hasActiveBreach: shipment.hasActiveBreach,
  };
}
