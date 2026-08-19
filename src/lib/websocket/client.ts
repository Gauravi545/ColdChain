import { WSEvent, WSEventType, WSTemperaturePayload, WSBreachPayload, WSSensorPayload, WSLocationPayload, WSDataSyncedPayload, BreachSeverity } from '@/types';

// ----------------------------------------------------------
// WEBSOCKET ABSTRACTION
// Replace MockWSClient with RealWSClient without changing consumers
// ----------------------------------------------------------

export type WSEventHandler<T = unknown> = (event: WSEvent<T>) => void;

export interface IWSClient {
  connect(): void;
  disconnect(): void;
  subscribe(shipmentId: string, handler: WSEventHandler): () => void;
  subscribeGlobal(handler: WSEventHandler): () => void;
}

// ----------------------------------------------------------
// MOCK WEBSOCKET CLIENT
// Simulates realistic realtime events for demo
// ----------------------------------------------------------

type Handler = WSEventHandler<unknown>;

export class MockWSClient implements IWSClient {
  private shipmentHandlers: Map<string, Set<Handler>> = new Map();
  private globalHandlers: Set<Handler> = new Set();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private connected = false;

  connect(): void {
    if (this.connected) return;
    this.connected = true;
    this.startSimulation();
  }

  disconnect(): void {
    this.connected = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  subscribe(shipmentId: string, handler: Handler): () => void {
    if (!this.shipmentHandlers.has(shipmentId)) {
      this.shipmentHandlers.set(shipmentId, new Set());
    }
    this.shipmentHandlers.get(shipmentId)!.add(handler);
    return () => {
      this.shipmentHandlers.get(shipmentId)?.delete(handler);
    };
  }

  subscribeGlobal(handler: Handler): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  private emit(event: WSEvent): void {
    // Dispatch to shipment-specific handlers
    this.shipmentHandlers.get(event.shipmentId)?.forEach((h) => h(event));
    // Dispatch to global handlers
    this.globalHandlers.forEach((h) => h(event));
  }

  private scheduleEvent(delay: number, fn: () => void): void {
    const t = setTimeout(fn, delay);
    this.timers.push(t);
  }

  private startSimulation(): void {
    // ----- SHP-1025 (ACTIVE BREACH) — ongoing temperature updates -----
    let temp = 11.6;
    const breach1025Loop = () => {
      if (!this.connected) return;
      temp = parseFloat((temp + (Math.random() - 0.4) * 0.3).toFixed(1));
      const condition = temp > 8 ? 'breach' : temp > 7.5 ? 'warning' : 'safe';
      const payload: WSTemperaturePayload = {
        temperature: temp,
        humidity: 62 + Math.random() * 5,
        sensorId: 'SENS-ESP32-007',
        condition,
      };
      this.emit({
        type: 'TEMPERATURE_UPDATE',
        shipmentId: 'SHP-1025',
        timestamp: new Date().toISOString(),
        payload,
      });

      if (condition === 'breach') {
        const breachPayload: WSBreachPayload = {
          ...payload,
          breach: {
            id: 'breach-1025-001',
            shipmentId: 'SHP-1025',
            startTime: '2026-08-17T13:48:00Z',
            durationMinutes: Math.floor((Date.now() - new Date('2026-08-17T13:48:00Z').getTime()) / 60000),
            maxTemperature: temp,
            allowedMax: 8,
            allowedMin: 2,
            severity: 'critical' as BreachSeverity,
            responsibleCustodian: 'XYZ Logistics',
            responsibleCustodianRole: 'transporter',
            custodyWindowStart: '2026-08-17T07:30:00Z',
            isResolved: false,
            sensorId: 'SENS-ESP32-007',
          },
        };
        this.emit({
          type: 'TEMPERATURE_BREACH',
          shipmentId: 'SHP-1025',
          timestamp: new Date().toISOString(),
          payload: breachPayload,
        });
      }

      this.scheduleEvent(8000, breach1025Loop);
    };
    this.scheduleEvent(3000, breach1025Loop);

    // ----- SHP-1024 — safe temperature updates -----
    let temp24 = 6.2;
    const temp1024Loop = () => {
      if (!this.connected) return;
      temp24 = parseFloat((temp24 + (Math.random() - 0.5) * 0.3).toFixed(1));
      temp24 = Math.max(2.5, Math.min(7.8, temp24));
      const payload: WSTemperaturePayload = {
        temperature: temp24,
        sensorId: 'SENS-ESP32-042',
        condition: 'safe',
      };
      this.emit({ type: 'TEMPERATURE_UPDATE', shipmentId: 'SHP-1024', timestamp: new Date().toISOString(), payload });
      this.scheduleEvent(10000, temp1024Loop);
    };
    this.scheduleEvent(5000, temp1024Loop);

    // ----- SHP-1026 — sensor OFFLINE → RECONNECT simulation -----
    this.scheduleEvent(15000, () => {
      if (!this.connected) return;
      const payload: WSSensorPayload = {
        sensorId: 'SENS-ESP32-019',
        status: 'online',
        pendingReadings: 0,
        offlineDurationMinutes: 0,
      };
      this.emit({ type: 'SENSOR_RECONNECTED', shipmentId: 'SHP-1026', timestamp: new Date().toISOString(), payload });

      // Then emit sync event
      this.scheduleEvent(2000, () => {
        if (!this.connected) return;
        const syncPayload: WSDataSyncedPayload = {
          sensorId: 'SENS-ESP32-019',
          readingsCount: 28,
          startTime: '2026-08-17T13:47:00Z',
          endTime: '2026-08-17T14:17:00Z',
          receivedAt: new Date().toISOString(),
          integrityVerified: true,
        };
        this.emit({ type: 'DATA_SYNCED', shipmentId: 'SHP-1026', timestamp: new Date().toISOString(), payload: syncPayload });
      });
    });

    // ----- SHP-1027 — location update -----
    this.scheduleEvent(20000, () => {
      if (!this.connected) return;
      const payload: WSLocationPayload = {
        location: { lat: 26.4, lng: 82.1, label: 'Allahabad Bypass', timestamp: new Date().toISOString() },
      };
      this.emit({ type: 'LOCATION_UPDATE', shipmentId: 'SHP-1027', timestamp: new Date().toISOString(), payload });
    });

    // ----- SHP-1029 — custody update (transporter picks up) -----
    this.scheduleEvent(30000, () => {
      if (!this.connected) return;
      this.emit({
        type: 'CUSTODY_UPDATED',
        shipmentId: 'SHP-1029',
        timestamp: new Date().toISOString(),
        payload: {
          transfer: {
            id: `cust-1029-ws-${Date.now()}`,
            shipmentId: 'SHP-1029',
            fromParty: 'BioPharm India Ltd.',
            fromPartyRole: 'manufacturer',
            toParty: 'NorthFreight Express',
            toPartyRole: 'transporter',
            timestamp: new Date().toISOString(),
            location: { lat: 28.6139, lng: 77.209, label: 'New Delhi', timestamp: new Date().toISOString() },
            temperature: 5.1,
            status: 'completed',
            blockchainTxHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
          },
        },
      });
    });
  }
}

// ----------------------------------------------------------
// SINGLETON INSTANCE
// ----------------------------------------------------------

let wsClientInstance: IWSClient | null = null;

export function getWSClient(): IWSClient {
  if (!wsClientInstance) {
    // Swap MockWSClient → RealWSClient when backend is available
    wsClientInstance = new MockWSClient();
  }
  return wsClientInstance;
}
