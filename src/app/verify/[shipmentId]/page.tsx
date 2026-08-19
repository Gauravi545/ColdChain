'use client';
import { use, useEffect, useState } from 'react';
import { getPublicShipmentVerification } from '@/lib/services/api';
import {
  ShieldCheck, Thermometer, GitBranch, CheckCircle2, XCircle,
  Package, Building2, AlertTriangle, ExternalLink, Thermometer as ThermIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOCKCHAIN_EXPLORER_URL } from '@/lib/constants';
import { truncateTxHash } from '@/lib/utils';

export default function VerifyPage({ params }: { params: Promise<{ shipmentId: string }> }) {
  const { shipmentId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPublicShipmentVerification(shipmentId)
      .then((d) => { if (!d) setError(true); else setData(d); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Verifying shipment…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-100 mb-2">Shipment Not Found</h1>
          <p className="text-slate-500 text-sm">
            The shipment ID <strong className="text-slate-300 font-mono">{shipmentId}</strong> could not be verified. 
            This QR code may be invalid or the shipment may not exist.
          </p>
        </div>
      </div>
    );
  }

  const isCompliant = data.temperatureCompliance;
  const isVerified = data.blockchainVerified;

  return (
    <div className="min-h-screen bg-[#0b1120] py-8 px-4">
      {/* Header */}
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-3">
            <ThermIcon size={22} className="text-white" />
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">ColdChain Platform</p>
          <p className="text-xs text-slate-600">Public Shipment Verification</p>
        </div>

        {/* Main verification card */}
        <div className={cn(
          'glass-card border rounded-2xl overflow-hidden mb-4',
          isVerified && isCompliant ? 'border-emerald-500/30' : data.hasActiveBreach ? 'border-red-500/30' : 'border-amber-500/30'
        )}>
          {/* Status banner */}
          <div className={cn(
            'px-6 py-5 text-center',
            isVerified && isCompliant && !data.hasActiveBreach
              ? 'bg-emerald-500/10'
              : data.hasActiveBreach ? 'bg-red-500/10' : 'bg-amber-500/10'
          )}>
            {isVerified && !data.hasActiveBreach ? (
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-2" />
            ) : data.hasActiveBreach ? (
              <AlertTriangle size={40} className="text-red-400 mx-auto mb-2 breach-pulse" />
            ) : (
              <AlertTriangle size={40} className="text-amber-400 mx-auto mb-2" />
            )}
            <p className={cn(
              'text-xl font-bold',
              isVerified && !data.hasActiveBreach ? 'text-emerald-400' :
              data.hasActiveBreach ? 'text-red-400' : 'text-amber-400'
            )}>
              {isVerified && !data.hasActiveBreach ? '✓ VERIFIED PRODUCT' :
               data.hasActiveBreach ? '⚠ ACTIVE BREACH' : '⚠ COMPLIANCE ISSUE'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isVerified && !data.hasActiveBreach
                ? 'This shipment has been blockchain-verified and is within compliance'
                : 'Temperature compliance issue detected on this shipment'}
            </p>
          </div>

          {/* Product info */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Product</p>
              <p className="text-lg font-bold text-slate-100">{data.product}</p>
              <p className="text-sm text-slate-500">{data.productType}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Shipment ID</p>
                <p className="font-mono text-cyan-400 font-semibold">{data.shipmentId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Batch Number</p>
                <p className="font-mono text-slate-300 text-xs">{data.batchNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Origin</p>
                <p className="text-slate-300">{data.origin}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Destination</p>
                <p className="text-slate-300">{data.destination}</p>
              </div>
            </div>

            <hr className="border-white/07" />

            {/* Verification checks */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verification Checks</p>

              <VerifyRow
                icon={isVerified ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                label="Authenticity"
                value={isVerified ? 'Verified on blockchain' : 'Not verified'}
                ok={isVerified}
              />

              <VerifyRow
                icon={isCompliant && !data.hasActiveBreach ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertTriangle size={16} className="text-amber-400" />}
                label="Temperature Compliance"
                value={data.hasActiveBreach ? 'Active breach detected' : isCompliant ? 'Within safe range' : 'Breach recorded (resolved)'}
                ok={isCompliant && !data.hasActiveBreach}
              />

              <VerifyRow
                icon={<GitBranch size={16} className="text-cyan-400" />}
                label="Chain of Custody"
                value={`${data.chainOfCustodyCount} custody event${data.chainOfCustodyCount !== 1 ? 's' : ''} recorded`}
                ok={true}
              />

              <VerifyRow
                icon={<ShieldCheck size={16} className="text-violet-400" />}
                label="Blockchain Verification"
                value={isVerified ? '✓ On-chain record exists' : 'Not recorded'}
                ok={isVerified}
              />
            </div>

            {/* Manufacturer / Custodian */}
            <hr className="border-white/07" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Building2 size={14} className="text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Manufacturer</p>
                  <p className="text-slate-300">{data.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package size={14} className="text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Current Custodian</p>
                  <p className="text-slate-300">{data.currentCustodian}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Thermometer size={14} className="text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Safe Temp Range</p>
                  <p className="text-slate-300">{data.safeTemperatureRange.min}°C – {data.safeTemperatureRange.max}°C</p>
                </div>
              </div>
            </div>

            {/* Blockchain link */}
            {data.lastBlockchainTx && (
              <>
                <hr className="border-white/07" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Last blockchain event</span>
                  <a
                    href={`${BLOCKCHAIN_EXPLORER_URL}/tx/${data.lastBlockchainTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-violet-400 hover:text-violet-300"
                  >
                    {truncateTxHash(data.lastBlockchainTx, 10)}
                    <ExternalLink size={10} />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600">
          Powered by ColdChain Provenance Platform · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function VerifyRow({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={cn('text-sm font-medium', ok ? 'text-slate-200' : 'text-amber-400')}>{value}</p>
      </div>
    </div>
  );
}
