import {
  Shipment,
  TemperatureReading,
  SensorStatus,
  CustodyTransfer,
  BreachEvent,
  BlockchainEvent,
  Alert,
  User,
  DashboardKPIs,
} from '@/types';

// ----------------------------------------------------------
// MOCK USERS
// ----------------------------------------------------------

export const MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Arjun Mehta',
    email: 'admin@coldchain.io',
    role: 'admin',
    organization: 'ColdChain Platform',
    createdAt: '2024-01-10T08:00:00Z',
    lastActive: '2026-08-17T14:00:00Z',
    isActive: true,
  },
  {
    id: 'usr-002',
    name: 'Priya Sharma',
    email: 'priya@biopharma.in',
    role: 'manufacturer',
    organization: 'BioPharm India Ltd.',
    createdAt: '2024-02-15T09:00:00Z',
    lastActive: '2026-08-17T13:45:00Z',
    isActive: true,
  },
  {
    id: 'usr-003',
    name: 'Rohan Das',
    email: 'rohan@xyzlogistics.in',
    role: 'transporter',
    organization: 'XYZ Logistics',
    createdAt: '2024-03-01T10:00:00Z',
    lastActive: '2026-08-17T14:05:00Z',
    isActive: true,
  },
  {
    id: 'usr-004',
    name: 'Neha Patel',
    email: 'neha@pharmdist.in',
    role: 'distributor',
    organization: 'PharmaDist Central',
    createdAt: '2024-03-15T11:00:00Z',
    lastActive: '2026-08-17T12:30:00Z',
    isActive: true,
  },
  {
    id: 'usr-005',
    name: 'Amit Singh',
    email: 'amit@mediretail.in',
    role: 'retailer',
    organization: 'MediRetail Chain',
    createdAt: '2024-04-01T08:00:00Z',
    lastActive: '2026-08-17T11:00:00Z',
    isActive: true,
  },
  {
    id: 'usr-006',
    name: 'Sneha Iyer',
    email: 'sneha@biopharma.in',
    role: 'manufacturer',
    organization: 'BioPharm India Ltd.',
    createdAt: '2024-05-10T09:00:00Z',
    lastActive: '2026-08-16T16:00:00Z',
    isActive: false,
  },
];

export const DEMO_USERS: Record<string, User> = {
  admin: MOCK_USERS[0],
  manufacturer: MOCK_USERS[1],
  transporter: MOCK_USERS[2],
  distributor: MOCK_USERS[3],
  retailer: MOCK_USERS[4],
};

// ----------------------------------------------------------
// MOCK SHIPMENTS
// ----------------------------------------------------------

export const MOCK_SHIPMENTS: Shipment[] = [
  // SHP-1024: BREACH SHIPMENT — The demo story shipment
  {
    id: 'SHP-1024',
    product: 'Hepatitis B Vaccine',
    productType: 'Pharmaceutical – Vaccine',
    batchNumber: 'BPL-HBV-2026-0417',
    origin: {
      lat: 28.6139,
      lng: 77.209,
      label: 'BioPharm India Ltd., New Delhi',
      timestamp: '2026-08-16T08:00:00Z',
      address: 'Plot 14, Pharma Zone, New Delhi 110001',
    },
    destination: {
      lat: 19.076,
      lng: 72.8777,
      label: 'MediRetail – Mumbai Central',
      timestamp: '2026-08-18T18:00:00Z',
      address: '42 MediRetail Plaza, Mumbai 400001',
    },
    safeTemperatureRange: { min: 2, max: 8, unit: 'C' },
    currentTemperature: 6.2,
    currentHumidity: 58,
    temperatureCondition: 'safe',
    currentCustodian: 'PharmaDist Central',
    currentCustodianRole: 'distributor',
    currentLocation: {
      lat: 21.1458,
      lng: 79.0882,
      label: 'PharmaDist Central, Nagpur',
      timestamp: '2026-08-17T14:00:00Z',
      address: 'Pharma Park, Nagpur 440001',
    },
    status: 'at_distributor',
    sensorStatus: 'online',
    sensorId: 'SENS-ESP32-042',
    createdAt: '2026-08-16T07:45:00Z',
    estimatedDelivery: '2026-08-18T18:00:00Z',
    hasActiveBreach: false,
    blockchainVerified: true,
  },

  // SHP-1025: ACTIVE BREACH SHIPMENT
  {
    id: 'SHP-1025',
    product: 'Insulin (Rapid-Acting)',
    productType: 'Pharmaceutical – Biologics',
    batchNumber: 'NOV-INS-2026-0891',
    origin: {
      lat: 12.9716,
      lng: 77.5946,
      label: 'Novo Nordisk Plant, Bengaluru',
      timestamp: '2026-08-17T06:00:00Z',
      address: 'KIADB Industrial Area, Bengaluru 560058',
    },
    destination: {
      lat: 13.0827,
      lng: 80.2707,
      label: 'ChennaiMed Distributor, Chennai',
      timestamp: '2026-08-18T12:00:00Z',
      address: 'Pharma Complex, Chennai 600001',
    },
    safeTemperatureRange: { min: 2, max: 8, unit: 'C' },
    currentTemperature: 11.6,
    currentHumidity: 62,
    temperatureCondition: 'breach',
    currentCustodian: 'XYZ Logistics',
    currentCustodianRole: 'transporter',
    currentLocation: {
      lat: 12.5,
      lng: 78.8,
      label: 'NH-44, Krishnagiri',
      timestamp: '2026-08-17T14:05:00Z',
      address: 'NH-44 Near Krishnagiri, Tamil Nadu',
    },
    status: 'in_transit',
    sensorStatus: 'online',
    sensorId: 'SENS-ESP32-007',
    createdAt: '2026-08-17T05:30:00Z',
    estimatedDelivery: '2026-08-18T12:00:00Z',
    hasActiveBreach: true,
    blockchainVerified: true,
  },

  // SHP-1026: OFFLINE SENSOR SHIPMENT
  {
    id: 'SHP-1026',
    product: 'COVID-19 mRNA Vaccine',
    productType: 'Pharmaceutical – Vaccine',
    batchNumber: 'PFZ-CV19-2026-1102',
    origin: {
      lat: 23.0225,
      lng: 72.5714,
      label: 'Pfizer Distribution Hub, Ahmedabad',
      timestamp: '2026-08-17T07:00:00Z',
      address: 'GIDC Industrial Estate, Ahmedabad 382445',
    },
    destination: {
      lat: 26.9124,
      lng: 75.7873,
      label: 'RajPharma Distributor, Jaipur',
      timestamp: '2026-08-17T22:00:00Z',
      address: 'Sanganeri Gate, Jaipur 302001',
    },
    safeTemperatureRange: { min: -80, max: -60, unit: 'C' },
    currentTemperature: -71.3,
    currentHumidity: 20,
    temperatureCondition: 'safe',
    currentCustodian: 'ArcticFreight Solutions',
    currentCustodianRole: 'transporter',
    currentLocation: {
      lat: 24.5854,
      lng: 73.7125,
      label: 'Near Udaipur',
      timestamp: '2026-08-17T13:47:00Z',
      address: 'NH-48, Rajsamand, Rajasthan',
    },
    status: 'in_transit',
    sensorStatus: 'offline',
    sensorId: 'SENS-ESP32-019',
    createdAt: '2026-08-17T06:45:00Z',
    estimatedDelivery: '2026-08-17T22:00:00Z',
    hasActiveBreach: false,
    blockchainVerified: true,
  },

  // SHP-1027: RECENTLY SYNCED / STORE-AND-FORWARD
  {
    id: 'SHP-1027',
    product: 'Polio Oral Vaccine',
    productType: 'Pharmaceutical – Vaccine',
    batchNumber: 'WHO-OPV-2026-0233',
    origin: {
      lat: 25.5941,
      lng: 85.1376,
      label: 'SERUM Institute, Patna',
      timestamp: '2026-08-17T05:00:00Z',
      address: 'Serum Campus, Patna 800001',
    },
    destination: {
      lat: 26.8467,
      lng: 80.9462,
      label: 'UP State Health Distributor, Lucknow',
      timestamp: '2026-08-17T20:00:00Z',
      address: 'Vibhuti Khand, Lucknow 226010',
    },
    safeTemperatureRange: { min: 2, max: 8, unit: 'C' },
    currentTemperature: 4.7,
    currentHumidity: 55,
    temperatureCondition: 'safe',
    currentCustodian: 'IndoFreight Express',
    currentCustodianRole: 'transporter',
    currentLocation: {
      lat: 26.1155,
      lng: 82.8953,
      label: 'Varanasi Route Checkpoint',
      timestamp: '2026-08-17T14:18:00Z',
      address: 'NH-19, Varanasi Bypass',
    },
    status: 'in_transit',
    sensorStatus: 'syncing',
    sensorId: 'SENS-ESP32-031',
    createdAt: '2026-08-17T04:45:00Z',
    estimatedDelivery: '2026-08-17T20:00:00Z',
    hasActiveBreach: false,
    blockchainVerified: true,
  },

  // SHP-1028: DELIVERED SAFE SHIPMENT
  {
    id: 'SHP-1028',
    product: 'Blood Plasma (Frozen)',
    productType: 'Blood Product',
    batchNumber: 'BLK-PLS-2026-0558',
    origin: {
      lat: 22.5726,
      lng: 88.3639,
      label: 'National Blood Bank, Kolkata',
      timestamp: '2026-08-15T10:00:00Z',
      address: 'Blood Bank Road, Kolkata 700016',
    },
    destination: {
      lat: 20.2961,
      lng: 85.8245,
      label: 'Odisha State Hospital, Bhubaneswar',
      timestamp: '2026-08-16T14:00:00Z',
      address: 'Capital Hospital, Bhubaneswar 751001',
    },
    safeTemperatureRange: { min: -30, max: -20, unit: 'C' },
    currentTemperature: -24.8,
    currentHumidity: 18,
    temperatureCondition: 'safe',
    currentCustodian: 'MediRetail Chain',
    currentCustodianRole: 'retailer',
    currentLocation: {
      lat: 20.2961,
      lng: 85.8245,
      label: 'Odisha State Hospital, Bhubaneswar',
      timestamp: '2026-08-16T13:55:00Z',
      address: 'Capital Hospital, Bhubaneswar 751001',
    },
    status: 'delivered',
    sensorStatus: 'online',
    sensorId: 'SENS-ESP32-054',
    createdAt: '2026-08-15T09:30:00Z',
    estimatedDelivery: '2026-08-16T14:00:00Z',
    hasActiveBreach: false,
    blockchainVerified: true,
  },

  // SHP-1029: REGISTERED — Waiting for pickup
  {
    id: 'SHP-1029',
    product: 'Rabies Vaccine',
    productType: 'Pharmaceutical – Vaccine',
    batchNumber: 'BPL-RAB-2026-0712',
    origin: {
      lat: 28.6139,
      lng: 77.209,
      label: 'BioPharm India Ltd., New Delhi',
      timestamp: '2026-08-17T15:00:00Z',
      address: 'Plot 14, Pharma Zone, New Delhi 110001',
    },
    destination: {
      lat: 30.7333,
      lng: 76.7794,
      label: 'HealthPharma Distributor, Chandigarh',
      timestamp: '2026-08-18T10:00:00Z',
      address: 'Sector 22, Chandigarh 160022',
    },
    safeTemperatureRange: { min: 2, max: 8, unit: 'C' },
    currentTemperature: 5.1,
    currentHumidity: 52,
    temperatureCondition: 'safe',
    currentCustodian: 'BioPharm India Ltd.',
    currentCustodianRole: 'manufacturer',
    currentLocation: {
      lat: 28.6139,
      lng: 77.209,
      label: 'BioPharm India Ltd., New Delhi',
      timestamp: '2026-08-17T15:00:00Z',
      address: 'Plot 14, Pharma Zone, New Delhi 110001',
    },
    status: 'registered',
    sensorStatus: 'online',
    sensorId: 'SENS-ESP32-061',
    createdAt: '2026-08-17T14:50:00Z',
    estimatedDelivery: '2026-08-18T10:00:00Z',
    hasActiveBreach: false,
    blockchainVerified: true,
  },
];

// ----------------------------------------------------------
// TEMPERATURE READINGS — SHP-1024 (breach story)
// ----------------------------------------------------------

function buildReadings(shipmentId: string, sensorId: string): TemperatureReading[] {
  const base = new Date('2026-08-16T08:00:00Z');
  const readings: TemperatureReading[] = [];

  // Safe window (manufacturer → transporter)
  const safeTemps = [5.2, 5.4, 5.1, 5.6, 5.3, 5.7, 5.5, 5.2];
  safeTemps.forEach((temp, i) => {
    const ts = new Date(base.getTime() + i * 30 * 60000).toISOString();
    readings.push({
      id: `rdg-${shipmentId}-${i}`,
      shipmentId,
      sensorId,
      temperature: temp,
      humidity: 55 + Math.random() * 5,
      timestamp: ts,
      receivedAt: ts,
      isOfflineSynced: false,
      isBreach: false,
    });
  });

  // Rising — transporter custody begins (~10:00)
  const risingTemps = [5.8, 6.1, 6.5, 7.2, 7.8, 8.9, 10.1, 11.6, 11.2, 10.8];
  risingTemps.forEach((temp, i) => {
    const ts = new Date(base.getTime() + (8 + i) * 30 * 60000).toISOString();
    readings.push({
      id: `rdg-${shipmentId}-rise-${i}`,
      shipmentId,
      sensorId,
      temperature: temp,
      humidity: 58 + Math.random() * 8,
      timestamp: ts,
      receivedAt: ts,
      isOfflineSynced: false,
      isBreach: temp > 8,
    });
  });

  // Recovery — back in range after fix
  const recoverTemps = [9.5, 8.1, 7.2, 6.4, 5.9, 5.5, 5.3, 6.2, 6.0, 5.8, 6.1, 6.2];
  recoverTemps.forEach((temp, i) => {
    const ts = new Date(base.getTime() + (18 + i) * 30 * 60000).toISOString();
    readings.push({
      id: `rdg-${shipmentId}-recover-${i}`,
      shipmentId,
      sensorId,
      temperature: temp,
      humidity: 55 + Math.random() * 5,
      timestamp: ts,
      receivedAt: ts,
      isOfflineSynced: false,
      isBreach: false,
    });
  });

  return readings;
}

export const MOCK_TEMPERATURE_READINGS: Record<string, TemperatureReading[]> = {
  'SHP-1024': buildReadings('SHP-1024', 'SENS-ESP32-042'),
  'SHP-1025': [
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `rdg-SHP-1025-${i}`,
      shipmentId: 'SHP-1025',
      sensorId: 'SENS-ESP32-007',
      temperature: 4.5 + Math.random() * 2,
      humidity: 56 + Math.random() * 5,
      timestamp: new Date(new Date('2026-08-17T06:00:00Z').getTime() + i * 30 * 60000).toISOString(),
      receivedAt: new Date(new Date('2026-08-17T06:00:00Z').getTime() + i * 30 * 60000).toISOString(),
      isOfflineSynced: false,
      isBreach: false,
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `rdg-SHP-1025-breach-${i}`,
      shipmentId: 'SHP-1025',
      sensorId: 'SENS-ESP32-007',
      temperature: [8.5, 9.8, 10.9, 11.6, 11.2][i],
      humidity: 62 + i,
      timestamp: new Date(new Date('2026-08-17T09:00:00Z').getTime() + i * 15 * 60000).toISOString(),
      receivedAt: new Date(new Date('2026-08-17T09:00:00Z').getTime() + i * 15 * 60000).toISOString(),
      isOfflineSynced: false,
      isBreach: true,
    })),
  ],
  'SHP-1027': [
    // Normal readings, then offline gap, then synced batch
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `rdg-SHP-1027-${i}`,
      shipmentId: 'SHP-1027',
      sensorId: 'SENS-ESP32-031',
      temperature: 4.5 + Math.random(),
      humidity: 53 + Math.random() * 4,
      timestamp: new Date(new Date('2026-08-17T05:00:00Z').getTime() + i * 30 * 60000).toISOString(),
      receivedAt: new Date(new Date('2026-08-17T05:00:00Z').getTime() + i * 30 * 60000).toISOString(),
      isOfflineSynced: false,
      isBreach: false,
    })),
    // Offline synced readings
    ...Array.from({ length: 28 }, (_, i) => ({
      id: `rdg-SHP-1027-sync-${i}`,
      shipmentId: 'SHP-1027',
      sensorId: 'SENS-ESP32-031',
      temperature: 4.2 + Math.random() * 1.5,
      humidity: 52 + Math.random() * 4,
      timestamp: new Date(new Date('2026-08-17T09:48:00Z').getTime() + i * 60000).toISOString(),
      receivedAt: '2026-08-17T14:18:00Z', // bulk received timestamp
      isOfflineSynced: true,
      isBreach: false,
    })),
  ],
};

// ----------------------------------------------------------
// MOCK SENSOR STATUSES
// ----------------------------------------------------------

export const MOCK_SENSOR_STATUSES: Record<string, SensorStatus> = {
  'SHP-1024': {
    sensorId: 'SENS-ESP32-042',
    shipmentId: 'SHP-1024',
    status: 'online',
    lastSync: '2026-08-17T14:00:00Z',
    lastReading: '2026-08-17T14:00:00Z',
    pendingReadings: 0,
    batteryLevel: 78,
    signalStrength: -62,
    firmwareVersion: '2.4.1',
  },
  'SHP-1025': {
    sensorId: 'SENS-ESP32-007',
    shipmentId: 'SHP-1025',
    status: 'online',
    lastSync: '2026-08-17T14:05:00Z',
    lastReading: '2026-08-17T14:05:00Z',
    pendingReadings: 0,
    batteryLevel: 55,
    signalStrength: -71,
    firmwareVersion: '2.4.1',
  },
  'SHP-1026': {
    sensorId: 'SENS-ESP32-019',
    shipmentId: 'SHP-1026',
    status: 'offline',
    lastSync: '2026-08-17T13:47:00Z',
    lastReading: '2026-08-17T13:47:00Z',
    pendingReadings: 28,
    offlineDurationMinutes: 30,
    batteryLevel: 41,
    signalStrength: undefined,
    firmwareVersion: '2.3.8',
  },
  'SHP-1027': {
    sensorId: 'SENS-ESP32-031',
    shipmentId: 'SHP-1027',
    status: 'syncing',
    lastSync: '2026-08-17T14:18:00Z',
    lastReading: '2026-08-17T14:17:00Z',
    pendingReadings: 0,
    batteryLevel: 63,
    signalStrength: -68,
    firmwareVersion: '2.4.0',
  },
  'SHP-1028': {
    sensorId: 'SENS-ESP32-054',
    shipmentId: 'SHP-1028',
    status: 'online',
    lastSync: '2026-08-16T14:00:00Z',
    lastReading: '2026-08-16T14:00:00Z',
    pendingReadings: 0,
    batteryLevel: 90,
    signalStrength: -55,
    firmwareVersion: '2.4.1',
  },
  'SHP-1029': {
    sensorId: 'SENS-ESP32-061',
    shipmentId: 'SHP-1029',
    status: 'online',
    lastSync: '2026-08-17T15:00:00Z',
    lastReading: '2026-08-17T15:00:00Z',
    pendingReadings: 0,
    batteryLevel: 100,
    signalStrength: -48,
    firmwareVersion: '2.4.1',
  },
};

// ----------------------------------------------------------
// MOCK CUSTODY TRANSFERS — SHP-1024
// ----------------------------------------------------------

export const MOCK_CUSTODY_TRANSFERS: Record<string, CustodyTransfer[]> = {
  'SHP-1024': [
    {
      id: 'cust-1024-001',
      shipmentId: 'SHP-1024',
      fromParty: 'BioPharm India Ltd.',
      fromPartyRole: 'manufacturer',
      toParty: 'XYZ Logistics',
      toPartyRole: 'transporter',
      timestamp: '2026-08-16T10:30:00Z',
      location: { lat: 28.6139, lng: 77.209, label: 'New Delhi', timestamp: '2026-08-16T10:30:00Z' },
      temperature: 5.4,
      status: 'completed',
      blockchainTxHash: '0xa1b2c3d4e5f601020304050607080910111213141516171819202122232425262728',
      notes: 'Handover at BioPharm dock. Temperature within range.',
    },
    {
      id: 'cust-1024-002',
      shipmentId: 'SHP-1024',
      fromParty: 'XYZ Logistics',
      fromPartyRole: 'transporter',
      toParty: 'PharmaDist Central',
      toPartyRole: 'distributor',
      timestamp: '2026-08-17T09:15:00Z',
      location: { lat: 21.1458, lng: 79.0882, label: 'Nagpur', timestamp: '2026-08-17T09:15:00Z' },
      temperature: 6.8,
      status: 'completed',
      blockchainTxHash: '0xb2c3d4e5f6070809101112131415161718192021222324252627282930313233',
      notes: 'Delivered to PharmaDist Central warehouse. Seal intact.',
    },
  ],
  'SHP-1025': [
    {
      id: 'cust-1025-001',
      shipmentId: 'SHP-1025',
      fromParty: 'Novo Nordisk Plant',
      fromPartyRole: 'manufacturer',
      toParty: 'XYZ Logistics',
      toPartyRole: 'transporter',
      timestamp: '2026-08-17T07:30:00Z',
      location: { lat: 12.9716, lng: 77.5946, label: 'Bengaluru', timestamp: '2026-08-17T07:30:00Z' },
      temperature: 4.2,
      status: 'completed',
      blockchainTxHash: '0xc3d4e5f60708091011121314151617181920212223242526272829303132333435',
    },
  ],
  'SHP-1026': [
    {
      id: 'cust-1026-001',
      shipmentId: 'SHP-1026',
      fromParty: 'Pfizer Distribution Hub',
      fromPartyRole: 'manufacturer',
      toParty: 'ArcticFreight Solutions',
      toPartyRole: 'transporter',
      timestamp: '2026-08-17T08:00:00Z',
      location: { lat: 23.0225, lng: 72.5714, label: 'Ahmedabad', timestamp: '2026-08-17T08:00:00Z' },
      temperature: -68.5,
      status: 'completed',
      blockchainTxHash: '0xd4e5f607080910111213141516171819202122232425262728293031323334353637',
    },
  ],
  'SHP-1027': [
    {
      id: 'cust-1027-001',
      shipmentId: 'SHP-1027',
      fromParty: 'SERUM Institute',
      fromPartyRole: 'manufacturer',
      toParty: 'IndoFreight Express',
      toPartyRole: 'transporter',
      timestamp: '2026-08-17T06:30:00Z',
      location: { lat: 25.5941, lng: 85.1376, label: 'Patna', timestamp: '2026-08-17T06:30:00Z' },
      temperature: 4.8,
      status: 'completed',
      blockchainTxHash: '0xe5f6070809101112131415161718192021222324252627282930313233343536373839',
    },
  ],
  'SHP-1028': [
    {
      id: 'cust-1028-001',
      shipmentId: 'SHP-1028',
      fromParty: 'National Blood Bank',
      fromPartyRole: 'manufacturer',
      toParty: 'CryoFreight India',
      toPartyRole: 'transporter',
      timestamp: '2026-08-15T10:30:00Z',
      location: { lat: 22.5726, lng: 88.3639, label: 'Kolkata', timestamp: '2026-08-15T10:30:00Z' },
      temperature: -23.5,
      status: 'completed',
      blockchainTxHash: '0xf607080910111213141516171819202122232425262728293031323334353637383940',
    },
    {
      id: 'cust-1028-002',
      shipmentId: 'SHP-1028',
      fromParty: 'CryoFreight India',
      fromPartyRole: 'transporter',
      toParty: 'MediRetail Chain',
      toPartyRole: 'retailer',
      timestamp: '2026-08-16T13:55:00Z',
      location: { lat: 20.2961, lng: 85.8245, label: 'Bhubaneswar', timestamp: '2026-08-16T13:55:00Z' },
      temperature: -24.8,
      status: 'completed',
      blockchainTxHash: '0x0708091011121314151617181920212223242526272829303132333435363738394041',
    },
  ],
  'SHP-1029': [],
};

// ----------------------------------------------------------
// MOCK BREACH EVENTS
// ----------------------------------------------------------

export const MOCK_BREACH_EVENTS: Record<string, BreachEvent[]> = {
  'SHP-1024': [
    {
      id: 'breach-1024-001',
      shipmentId: 'SHP-1024',
      startTime: '2026-08-16T14:05:00Z',
      endTime: '2026-08-16T14:22:00Z',
      durationMinutes: 17,
      maxTemperature: 11.6,
      allowedMax: 8,
      allowedMin: 2,
      severity: 'high',
      responsibleCustodian: 'XYZ Logistics',
      responsibleCustodianRole: 'transporter',
      custodyWindowStart: '2026-08-16T10:30:00Z',
      custodyWindowEnd: '2026-08-17T09:15:00Z',
      location: { lat: 22.3039, lng: 73.1812, label: 'NH-48, Vadodara', timestamp: '2026-08-16T14:05:00Z' },
      blockchainTxHash: '0xaabbccddee0011223344556677889900aabbccddee0011223344556677889900aa',
      isResolved: true,
      sensorId: 'SENS-ESP32-042',
    },
  ],
  'SHP-1025': [
    {
      id: 'breach-1025-001',
      shipmentId: 'SHP-1025',
      startTime: '2026-08-17T13:48:00Z',
      endTime: undefined,
      durationMinutes: 17,
      maxTemperature: 11.6,
      allowedMax: 8,
      allowedMin: 2,
      severity: 'critical',
      responsibleCustodian: 'XYZ Logistics',
      responsibleCustodianRole: 'transporter',
      custodyWindowStart: '2026-08-17T07:30:00Z',
      custodyWindowEnd: undefined,
      location: { lat: 12.5, lng: 78.8, label: 'NH-44, Krishnagiri', timestamp: '2026-08-17T13:48:00Z' },
      blockchainTxHash: '0xbbccddee001122334455667788990011bbccddee001122334455667788990011bb',
      isResolved: false,
      sensorId: 'SENS-ESP32-007',
    },
  ],
};

// ----------------------------------------------------------
// MOCK BLOCKCHAIN EVENTS
// ----------------------------------------------------------

export const MOCK_BLOCKCHAIN_EVENTS: Record<string, BlockchainEvent[]> = {
  'SHP-1024': [
    {
      id: 'bc-1024-001',
      shipmentId: 'SHP-1024',
      eventType: 'SHIPMENT_REGISTERED',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      dataHash: '0xaabbccdd11223344aabbccdd11223344aabbccdd11223344aabbccdd11223344aa',
      timestamp: '2026-08-16T07:45:00Z',
      blockNumber: 18400201,
      verificationStatus: 'verified',
    },
    {
      id: 'bc-1024-002',
      shipmentId: 'SHP-1024',
      eventType: 'CUSTODY_TRANSFERRED',
      txHash: '0xa1b2c3d4e5f601020304050607080910111213141516171819202122232425262728',
      dataHash: '0xbbccdd1122334455bbccdd1122334455bbccdd1122334455bbccdd1122334455bb',
      timestamp: '2026-08-16T10:30:00Z',
      blockNumber: 18402455,
      verificationStatus: 'verified',
    },
    {
      id: 'bc-1024-003',
      shipmentId: 'SHP-1024',
      eventType: 'TEMPERATURE_BREACH',
      txHash: '0xaabbccddee0011223344556677889900aabbccddee0011223344556677889900aa',
      dataHash: '0xccdd11223344556677ccdd11223344556677ccdd11223344556677ccdd11223344',
      timestamp: '2026-08-16T14:05:00Z',
      blockNumber: 18405812,
      verificationStatus: 'verified',
    },
    {
      id: 'bc-1024-004',
      shipmentId: 'SHP-1024',
      eventType: 'CUSTODY_TRANSFERRED',
      txHash: '0xb2c3d4e5f6070809101112131415161718192021222324252627282930313233',
      dataHash: '0xdd11223344556677889900dd11223344556677889900dd11223344556677889900',
      timestamp: '2026-08-17T09:15:00Z',
      blockNumber: 18420311,
      verificationStatus: 'verified',
    },
  ],
  'SHP-1025': [
    {
      id: 'bc-1025-001',
      shipmentId: 'SHP-1025',
      eventType: 'SHIPMENT_REGISTERED',
      txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      dataHash: '0xeeff00112233445566778899eeff00112233445566778899eeff00112233445566',
      timestamp: '2026-08-17T05:30:00Z',
      blockNumber: 18429100,
      verificationStatus: 'verified',
    },
    {
      id: 'bc-1025-002',
      shipmentId: 'SHP-1025',
      eventType: 'TEMPERATURE_BREACH',
      txHash: '0xbbccddee001122334455667788990011bbccddee001122334455667788990011bb',
      dataHash: '0xff001122334455667788990011ff001122334455667788990011ff001122334455',
      timestamp: '2026-08-17T13:48:00Z',
      blockNumber: 18432776,
      verificationStatus: 'verified',
    },
  ],
};

// ----------------------------------------------------------
// MOCK ALERTS
// ----------------------------------------------------------

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt-001',
    shipmentId: 'SHP-1025',
    shipmentName: 'Insulin (Rapid-Acting)',
    type: 'temperature_breach',
    severity: 'critical',
    title: 'Temperature Breach Detected',
    message: 'SHP-1025 has exceeded the maximum allowed temperature. Current: 11.6°C, Max: 8°C. Custody: XYZ Logistics.',
    timestamp: '2026-08-17T13:48:00Z',
    isAcknowledged: false,
    custodian: 'XYZ Logistics',
  },
  {
    id: 'alt-002',
    shipmentId: 'SHP-1026',
    shipmentName: 'COVID-19 mRNA Vaccine',
    type: 'sensor_offline',
    severity: 'warning',
    title: 'Sensor Offline',
    message: 'Sensor SENS-ESP32-019 on SHP-1026 has been offline for 30 minutes. 28 readings pending sync.',
    timestamp: '2026-08-17T13:47:00Z',
    isAcknowledged: false,
    custodian: 'ArcticFreight Solutions',
  },
  {
    id: 'alt-003',
    shipmentId: 'SHP-1027',
    shipmentName: 'Polio Oral Vaccine',
    type: 'delayed_sync',
    severity: 'warning',
    title: 'Delayed Data Sync',
    message: 'SHP-1027 sensor went offline and is now synchronizing 28 stored readings.',
    timestamp: '2026-08-17T14:18:00Z',
    isAcknowledged: true,
    acknowledgedBy: 'Arjun Mehta',
    acknowledgedAt: '2026-08-17T14:20:00Z',
    custodian: 'IndoFreight Express',
  },
  {
    id: 'alt-004',
    shipmentId: 'SHP-1024',
    shipmentName: 'Hepatitis B Vaccine',
    type: 'temperature_breach',
    severity: 'warning',
    title: 'Past Breach — Resolved',
    message: 'SHP-1024 experienced a temperature breach on 16 Aug. Breach resolved. Blockchain event recorded.',
    timestamp: '2026-08-16T14:22:00Z',
    isAcknowledged: true,
    acknowledgedBy: 'Arjun Mehta',
    acknowledgedAt: '2026-08-16T15:00:00Z',
    custodian: 'XYZ Logistics',
  },
  {
    id: 'alt-005',
    shipmentId: 'SHP-1029',
    shipmentName: 'Rabies Vaccine',
    type: 'custody_pending',
    severity: 'info',
    title: 'Custody Transfer Pending',
    message: 'SHP-1029 is awaiting transporter pickup from BioPharm India Ltd.',
    timestamp: '2026-08-17T15:05:00Z',
    isAcknowledged: false,
    custodian: 'BioPharm India Ltd.',
  },
];

// ----------------------------------------------------------
// DASHBOARD KPIs
// ----------------------------------------------------------

export const MOCK_DASHBOARD_KPIS: DashboardKPIs = {
  totalActiveShipments: 5,
  safeShipments: 4,
  temperatureBreaches: 1,
  offlineSensors: 1,
  pendingCustodyTransfers: 1,
  deliveredToday: 0,
};

// ----------------------------------------------------------
// ROUTE HISTORY (GPS tracks)
// ----------------------------------------------------------

export const MOCK_ROUTE_HISTORY: Record<string, { lat: number; lng: number; timestamp: string }[]> = {
  'SHP-1024': [
    { lat: 28.6139, lng: 77.209, timestamp: '2026-08-16T08:00:00Z' },
    { lat: 27.1767, lng: 77.993, timestamp: '2026-08-16T11:00:00Z' },
    { lat: 25.3176, lng: 82.9739, timestamp: '2026-08-16T17:00:00Z' },
    { lat: 22.7196, lng: 75.8577, timestamp: '2026-08-17T00:00:00Z' },
    { lat: 21.1458, lng: 79.0882, timestamp: '2026-08-17T09:00:00Z' },
  ],
  'SHP-1025': [
    { lat: 12.9716, lng: 77.5946, timestamp: '2026-08-17T06:00:00Z' },
    { lat: 12.75, lng: 78.2, timestamp: '2026-08-17T10:00:00Z' },
    { lat: 12.5, lng: 78.8, timestamp: '2026-08-17T14:05:00Z' },
  ],
  'SHP-1026': [
    { lat: 23.0225, lng: 72.5714, timestamp: '2026-08-17T07:00:00Z' },
    { lat: 23.8388, lng: 72.8082, timestamp: '2026-08-17T09:30:00Z' },
    { lat: 24.5854, lng: 73.7125, timestamp: '2026-08-17T13:47:00Z' },
  ],
  'SHP-1027': [
    { lat: 25.5941, lng: 85.1376, timestamp: '2026-08-17T05:00:00Z' },
    { lat: 25.8, lng: 84.0, timestamp: '2026-08-17T08:00:00Z' },
    { lat: 26.1155, lng: 82.8953, timestamp: '2026-08-17T14:18:00Z' },
  ],
  'SHP-1028': [
    { lat: 22.5726, lng: 88.3639, timestamp: '2026-08-15T10:00:00Z' },
    { lat: 21.5, lng: 86.9, timestamp: '2026-08-15T16:00:00Z' },
    { lat: 20.2961, lng: 85.8245, timestamp: '2026-08-16T13:55:00Z' },
  ],
};
