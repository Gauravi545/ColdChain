'use client';
import { use, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getShipment, getTemperatureHistory, getSensorStatus,
  getCustodyHistory, getBreachEvents, getBlockchainHistory, generateIncidentReport,
} from '@/lib/services/api';
import { useAuth } from '@/lib/auth/context';
import { getWSClient } from '@/lib/websocket/client';
import { WSEvent, WSTemperaturePayload, WSBreachPayload, WSSensorPayload, WSDataSyncedPayload } from '@/types';
import { canTransferCustody, canGenerateReport } from '@/lib/permissions';

import { LoadingState, ErrorState } from '@/components/ui/States';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { SensorStatusCard } from '@/components/sensors/SensorStatus';
import { CustodyTimeline } from '@/components/custody/CustodyTimeline';
import { BreachCard } from '@/components/shipments/BreachCard';
import { BlockchainProof } from '@/components/blockchain/BlockchainProof';
import { QRGenerator } from '@/components/qr/QRGenerator';
import { CustodyTransferModal } from '@/components/custody/CustodyTransferModal';
import { ShipmentStatusBadge, SensorStatusBadge } from '@/components/shipments/ShipmentStatusBadge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

import { formatTemp, formatTimestamp, cn } from '@/lib/utils';
import {
  Thermometer, MapPin, Package, User, ArrowLeftRight,
  Activity, Shield, QrCode, FileText, ChevronDown, ChevronUp,
  ShieldCheck, AlertTriangle, GitBranch
} from 'lucide-react';

type Tab = 'overview' | 'temperature' | 'custody' | 'blockchain' | 'qr';

export default function ShipmentDetailPage({ params }: { params: Promise<{ shipmentId: string }> }) {
  const { shipmentId } = use(params);
  const { role, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [liveTemp, setLiveTemp] = useState<number | null>(null);
  const [liveSyncData, setLiveSyncData] = useState<WSDataSyncedPayload | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: shipment, isLoading, error } = useQuery({
    queryKey: ['shipment', shipmentId],
    queryFn: () => getShipment(shipmentId),
  });

  const { data: tempHistory } = useQuery({
    queryKey: ['temp-history', shipmentId],
    queryFn: () => getTemperatureHistory(shipmentId),
    enabled: !!shipment,
  });

  const { data: sensor, refetch: refetchSensor } = useQuery({
    queryKey: ['sensor', shipmentId],
    queryFn: () => getSensorStatus(shipmentId),
    enabled: !!shipment,
  });

  const { data: custody, refetch: refetchCustody } = useQuery({
    queryKey: ['custody', shipmentId],
    queryFn: () => getCustodyHistory(shipmentId),
    enabled: !!shipment,
  });

  const { data: breaches } = useQuery({
    queryKey: ['breaches', shipmentId],
    queryFn: () => getBreachEvents(shipmentId),
    enabled: !!shipment,
  });

  const { data: blockchain } = useQuery({
    queryKey: ['blockchain', shipmentId],
    queryFn: () => getBlockchainHistory(shipmentId),
    enabled: !!shipment,
  });

  // Subscribe to real-time events
  useEffect(() => {
    const ws = getWSClient();
    const unsub = ws.subscribe(shipmentId, (event: WSEvent) => {
      if (event.type === 'TEMPERATURE_UPDATE') {
        const p = event.payload as WSTemperaturePayload;
        setLiveTemp(p.temperature);
      }
      if (event.type === 'TEMPERATURE_BREACH') {
        const p = event.payload as WSBreachPayload;
        setLiveTemp(p.temperature);
        toast('error', '⚠ Temperature Breach', `${shipmentId}: ${formatTemp(p.temperature)} — Custody: ${shipment?.currentCustodian}`);
        queryClient.invalidateQueries({ queryKey: ['breaches', shipmentId] });
      }
      if (event.type === 'SENSOR_RECONNECTED') {
        toast('success', 'Sensor Reconnected', `${shipmentId}: sensor back online`);
        refetchSensor();
      }
      if (event.type === 'DATA_SYNCED') {
        const p = event.payload as WSDataSyncedPayload;
        setLiveSyncData(p);
        toast('info', `${p.readingsCount} readings synchronized`, `Integrity: ${p.integrityVerified ? 'Verified ✓' : 'Failed'}`);
        queryClient.invalidateQueries({ queryKey: ['temp-history', shipmentId] });
        refetchSensor();
      }
      if (event.type === 'CUSTODY_UPDATED') {
        refetchCustody();
        queryClient.invalidateQueries({ queryKey: ['shipment', shipmentId] });
        toast('info', 'Custody Updated', `${shipmentId} custody has changed`);
      }
    });
    return unsub;
  }, [shipmentId, shipment, queryClient, refetchSensor, refetchCustody, toast]);

  const handleGenerateReport = async () => {
    if (!user) return;
    setIsGeneratingReport(true);
    try {
      const r = await generateIncidentReport(shipmentId, user.id);
      setReport(r);
      setShowReportModal(true);
      toast('success', 'Report generated', 'Incident report is ready for review');
    } catch (e: any) {
      toast('error', 'Report failed', e.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const currentTemp = liveTemp ?? shipment?.currentTemperature;
  const tempCondition = !shipment ? 'safe' :
    currentTemp! > shipment.safeTemperatureRange.max || currentTemp! < shipment.safeTemperatureRange.min
      ? 'breach' : 'safe';

  if (isLoading) return <LoadingState message="Loading shipment…" />;
  if (error || !shipment) return <ErrorState message="Shipment not found" />;

  const hasActiveBreach = breaches?.some((b) => !b.isResolved);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
    { id: 'temperature', label: 'Temperature', icon: <Thermometer size={14} /> },
    { id: 'custody', label: 'Custody', icon: <GitBranch size={14} /> },
    { id: 'blockchain', label: 'Blockchain', icon: <Shield size={14} /> },
    { id: 'qr', label: 'QR Code', icon: <QrCode size={14} /> },
  ];

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-lg font-bold text-cyan-400">{shipment.id}</span>
            <ShipmentStatusBadge status={shipment.status} />
            <SensorStatusBadge status={sensor?.status ?? shipment.sensorStatus} />
            {hasActiveBreach && (
              <Badge variant="breach" dot className="breach-pulse">Active Breach</Badge>
            )}
            {shipment.blockchainVerified && (
              <Badge variant="verified"><ShieldCheck size={10} className="mr-1" />Blockchain Verified</Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">{shipment.product}</h1>
          <p className="text-sm text-slate-500">{shipment.productType} · Batch {shipment.batchNumber}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {role && canTransferCustody(role) && shipment.status !== 'delivered' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeftRight size={13} />}
              onClick={() => setShowTransferModal(true)}
            >
              Transfer Custody
            </Button>
          )}
          {role && canGenerateReport(role) && breaches && breaches.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<FileText size={13} />}
              loading={isGeneratingReport}
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          )}
        </div>
      </div>

      {/* Active breach banner */}
      {hasActiveBreach && (
        <div className="glass-card border border-red-500/40 bg-red-500/5 p-4 rounded-xl flex items-center gap-3 breach-pulse">
          <AlertTriangle size={18} className="text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">TEMPERATURE BREACH ACTIVE</p>
            <p className="text-xs text-slate-400">
              Current: <strong className="text-red-300">{formatTemp(currentTemp!)}</strong>
              {' '}— Allowed: {shipment.safeTemperatureRange.min}–{shipment.safeTemperatureRange.max}°C
              {' '}— Custody: <strong>{shipment.currentCustodian}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Temp */}
        <div className={cn(
          'glass-card border p-4 text-center',
          tempCondition === 'breach' ? 'border-red-500/30' : 'border-emerald-500/20'
        )}>
          <Thermometer size={16} className={cn('mx-auto mb-1', tempCondition === 'breach' ? 'text-red-400' : 'text-emerald-400')} />
          <p className={cn('text-2xl font-bold font-mono', tempCondition === 'breach' ? 'text-red-400 breach-pulse' : 'text-emerald-400')}>
            {formatTemp(currentTemp!)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Range: {shipment.safeTemperatureRange.min}–{shipment.safeTemperatureRange.max}°C
          </p>
          {liveTemp && <p className="text-xs text-cyan-400 mt-0.5">● Live</p>}
        </div>

        {/* Custodian */}
        <div className="glass-card border border-white/07 p-4 text-center">
          <User size={16} className="mx-auto mb-1 text-slate-500" />
          <p className="text-sm font-semibold text-slate-200 truncate">{shipment.currentCustodian}</p>
          <p className="text-xs text-slate-500 capitalize mt-0.5">{shipment.currentCustodianRole}</p>
        </div>

        {/* Location */}
        <div className="glass-card border border-white/07 p-4 text-center">
          <MapPin size={16} className="mx-auto mb-1 text-slate-500" />
          <p className="text-sm font-semibold text-slate-200 truncate">{shipment.currentLocation.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">Current location</p>
        </div>

        {/* Status */}
        <div className="glass-card border border-white/07 p-4 text-center">
          <Package size={16} className="mx-auto mb-1 text-slate-500" />
          <p className="text-sm font-semibold text-slate-200">
            {shipment.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">ETA: {formatTimestamp(shipment.estimatedDelivery)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/07 pb-0 -mb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-2">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sensor status */}
            {sensor && (
              <SensorStatusCard
                sensor={{ ...sensor, status: sensor.status }}
                syncData={liveSyncData ? {
                  readingsCount: liveSyncData.readingsCount,
                  startTime: liveSyncData.startTime,
                  endTime: liveSyncData.endTime,
                  receivedAt: liveSyncData.receivedAt,
                  integrityVerified: liveSyncData.integrityVerified,
                } : undefined}
              />
            )}

            {/* Shipment details */}
            <div className="glass-card border border-white/07 p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Shipment Details</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Origin', value: shipment.origin.label },
                  { label: 'Destination', value: shipment.destination.label },
                  { label: 'Safe Range', value: `${shipment.safeTemperatureRange.min}°C – ${shipment.safeTemperatureRange.max}°C` },
                  { label: 'Sensor ID', value: shipment.sensorId },
                  { label: 'Created', value: formatTimestamp(shipment.createdAt) },
                  { label: 'Est. Delivery', value: formatTimestamp(shipment.estimatedDelivery) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-slate-300 text-right font-mono text-xs">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Breach history */}
            {breaches && breaches.length > 0 && (
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">Breach History & Accountability</h3>
                {breaches.map((breach) => (
                  <BreachCard key={breach.id} breach={breach} isActive={!breach.isResolved} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TEMPERATURE */}
        {activeTab === 'temperature' && (
          <div className="glass-card border border-white/07 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Temperature History</h3>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-slate-500">Live data</span>
                {liveTemp && <span className="text-cyan-400 font-mono font-bold">{formatTemp(liveTemp)}</span>}
              </div>
            </div>
            <TemperatureChart
              readings={tempHistory ?? []}
              safeRange={shipment.safeTemperatureRange}
              height={320}
            />
          </div>
        )}

        {/* CUSTODY */}
        {activeTab === 'custody' && (
          <div className="glass-card border border-white/07 p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-5">Chain of Custody</h3>
            <CustodyTimeline
              transfers={custody ?? []}
              originParty={shipment.origin.label.split(',')[0]}
            />
          </div>
        )}

        {/* BLOCKCHAIN */}
        {activeTab === 'blockchain' && (
          <div className="glass-card border border-white/07 p-5">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={16} className="text-violet-400" />
              <h3 className="text-sm font-semibold text-slate-200">Blockchain Verification</h3>
              <Badge variant="verified" className="ml-auto">✓ Chain Verified</Badge>
            </div>
            <BlockchainProof events={blockchain ?? []} />
          </div>
        )}

        {/* QR */}
        {activeTab === 'qr' && (
          <div className="flex justify-center">
            <QRGenerator shipmentId={shipment.id} productName={shipment.product} size={200} />
          </div>
        )}
      </div>

      {/* Custody Transfer Modal */}
      <CustodyTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        shipment={shipment}
        onSuccess={() => {
          refetchCustody();
          queryClient.invalidateQueries({ queryKey: ['shipment', shipmentId] });
          setShowTransferModal(false);
          toast('success', 'Custody transferred', 'Blockchain event recorded successfully');
        }}
      />

      {/* Report Modal */}
      {showReportModal && report && (
        <IncidentReportModal report={report} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

// ---- Incident Report Modal (inline for page) ----
function IncidentReportModal({ report, onClose }: { report: any; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  if (!open) { onClose(); return null; }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative glass-card border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto fade-in">
        <h2 className="text-lg font-bold text-slate-100 mb-1">Incident Report</h2>
        <p className="text-xs text-slate-500 mb-5">Generated by {report.generatedBy} · {formatTimestamp(report.generatedAt)}</p>
        
        <div className="space-y-4 text-sm">
          <Section label="Shipment">
            <Row k="ID" v={report.shipmentId} />
            <Row k="Product" v={report.product} />
            <Row k="Batch" v={report.batchNumber} />
            <Row k="Safe Range" v={`${report.safeTemperatureRange.min}–${report.safeTemperatureRange.max}°C`} />
          </Section>
          <Section label="Temperature Breach">
            <Row k="Recorded Temp" v={formatTemp(report.breach.maxTemperature)} className="text-red-400" />
            <Row k="Duration" v={`${report.breach.durationMinutes} minutes`} />
            <Row k="Severity" v={report.breach.severity.toUpperCase()} />
          </Section>
          <Section label="Accountability">
            <Row k="Responsible Custodian" v={report.breach.responsibleCustodian} className="text-amber-400 font-semibold" />
            <Row k="Custody Window" v={`${formatTimestamp(report.breach.custodyWindowStart)} — ongoing`} />
          </Section>
          <Section label="Data Integrity">
            <Row k="Blockchain Events" v={`${report.blockchainEvents.length} records`} />
            <Row k="Integrity Verified" v={report.dataIntegrityVerified ? '✓ Yes' : '✗ No'} className={report.dataIntegrityVerified ? 'text-emerald-400' : 'text-red-400'} />
          </Section>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button variant="primary">Export PDF (Mock)</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{label}</p>
      <div className="glass-card border border-white/07 p-3 space-y-2">{children}</div>
    </div>
  );
}
function Row({ k, v, className }: { k: string; v: string; className?: string }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-slate-500">{k}</span>
      <span className={cn('text-right font-medium', className ?? 'text-slate-300')}>{v}</span>
    </div>
  );
}
