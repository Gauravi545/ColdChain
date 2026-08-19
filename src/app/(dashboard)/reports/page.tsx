'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShipments, generateIncidentReport } from '@/lib/services/api';
import { useAuth } from '@/lib/auth/context';
import { LoadingState, EmptyState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, AlertTriangle } from 'lucide-react';
import { formatTemp, formatTimestamp, cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { canGenerateReport } from '@/lib/permissions';

export default function ReportsPage() {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [reports, setReports] = useState<Record<string, any>>({});

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['shipments', role],
    queryFn: () => getShipments({}, role ?? undefined),
  });

  // Only show shipments with breach history
  const breachShipments = shipments?.filter((s) =>
    ['SHP-1024', 'SHP-1025'].includes(s.id)
  ) ?? [];

  const handleGenerate = async (shipmentId: string) => {
    if (!user) return;
    setGeneratingId(shipmentId);
    try {
      const report = await generateIncidentReport(shipmentId, user.id);
      setReports((prev) => ({ ...prev, [shipmentId]: report }));
      toast('success', 'Report generated', `Incident report for ${shipmentId} ready`);
    } catch (e: any) {
      toast('error', 'Failed to generate report', e.message);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Generate incident and insurance reports for shipments with temperature breaches</p>
      </div>

      {!role || !canGenerateReport(role) ? (
        <div className="glass-card border border-amber-500/20 p-6 text-center">
          <p className="text-amber-400">Your role does not have permission to generate reports</p>
        </div>
      ) : isLoading ? (
        <LoadingState />
      ) : breachShipments.length === 0 ? (
        <EmptyState icon={<FileText size={32} />} title="No breach records" message="No shipments with breach history available for reporting" />
      ) : (
        <div className="space-y-4">
          {breachShipments.map((shipment) => {
            const report = reports[shipment.id];
            return (
              <div key={shipment.id} className="glass-card border border-red-500/20 p-5 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-cyan-400">{shipment.id}</span>
                      <Badge variant="breach" size="sm"><AlertTriangle size={10} className="mr-1" />Breach Recorded</Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{shipment.product}</p>
                    <p className="text-xs text-slate-500">Batch: {shipment.batchNumber}</p>
                  </div>
                  <Button
                    variant={report ? 'secondary' : 'danger'}
                    size="sm"
                    icon={<FileText size={13} />}
                    loading={generatingId === shipment.id}
                    onClick={() => handleGenerate(shipment.id)}
                  >
                    {report ? 'Regenerate' : 'Generate Report'}
                  </Button>
                </div>

                {report && (
                  <div className="border-t border-white/07 pt-4 mt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Report Summary</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-slate-500 mb-1">Max Temp</p>
                        <p className="text-red-400 font-bold">{formatTemp(report.breach.maxTemperature)}</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-slate-500 mb-1">Duration</p>
                        <p className="text-amber-400 font-bold">{report.breach.durationMinutes} min</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-slate-500 mb-1">Custodian</p>
                        <p className="text-slate-200 font-bold truncate">{report.breach.responsibleCustodian}</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-slate-500 mb-1">Integrity</p>
                        <p className="text-emerald-400 font-bold">{report.dataIntegrityVerified ? '✓ Verified' : '✗ Failed'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-3">
                      Generated {formatTimestamp(report.generatedAt)} by {report.generatedBy}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">View Full Report</Button>
                      <Button variant="secondary" size="sm">Export PDF (Mock)</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
