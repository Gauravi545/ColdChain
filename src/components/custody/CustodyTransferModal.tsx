'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Shipment, UserRole } from '@/types';
import { transferCustody } from '@/lib/services/api';
import { ROLE_LABELS } from '@/lib/constants';
import { formatTemp } from '@/lib/utils';
import { ArrowRight, CheckCircle2, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustodyTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
  onSuccess: () => void;
}

const RECEIVING_PARTIES: { label: string; role: UserRole; orgs: string[] }[] = [
  { label: 'Transporter', role: 'transporter', orgs: ['XYZ Logistics', 'IndoFreight Express', 'ArcticFreight Solutions', 'NorthFreight Express'] },
  { label: 'Distributor', role: 'distributor', orgs: ['PharmaDist Central', 'RajPharma Distributor', 'ChennaiMed Distributor'] },
  { label: 'Retailer', role: 'retailer', orgs: ['MediRetail Chain', 'Odisha State Hospital'] },
];

type Step = 1 | 2 | 3;

export function CustodyTransferModal({ isOpen, onClose, shipment, onSuccess }: CustodyTransferModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [temperature, setTemperature] = useState(shipment.currentTemperature.toFixed(1));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(1);
    setSelectedRole(null);
    setSelectedOrg('');
    setTemperature(shipment.currentTemperature.toFixed(1));
    setNotes('');
    setDone(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedRole || !selectedOrg) return;
    setLoading(true);
    try {
      await transferCustody(shipment.id, selectedOrg, selectedRole, parseFloat(temperature), notes || undefined);
      setDone(true);
      setTimeout(() => {
        onSuccess();
        reset();
      }, 2000);
    } catch {
      // error handled by toast in parent
    } finally {
      setLoading(false);
    }
  };

  const selectedParty = RECEIVING_PARTIES.find((p) => p.role === selectedRole);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Transfer Custody" size="md">
      <div className="p-6">
        {done ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-emerald-400">Custody Transferred</p>
            <p className="text-sm text-slate-500 mt-1">Blockchain event recorded successfully</p>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    step >= s ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-500'
                  )}>
                    {s}
                  </div>
                  {s < 3 && <div className={cn('h-px flex-1 w-8', step > s ? 'bg-cyan-500' : 'bg-slate-700')} />}
                </div>
              ))}
              <span className="ml-2 text-xs text-slate-500">
                {step === 1 ? 'Select party' : step === 2 ? 'Select organization' : 'Confirm transfer'}
              </span>
            </div>

            {/* From */}
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg text-sm">
              <p className="text-xs text-slate-500 mb-0.5">Transferring from</p>
              <p className="font-semibold text-slate-200">{shipment.currentCustodian}</p>
              <p className="text-xs text-slate-500 capitalize">{ROLE_LABELS[shipment.currentCustodianRole]}</p>
            </div>

            {/* Step 1: Select role */}
            {step === 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300 mb-3">Select receiving party type</p>
                {RECEIVING_PARTIES.map((party) => (
                  <button
                    key={party.role}
                    onClick={() => { setSelectedRole(party.role); setSelectedOrg(''); setStep(2); }}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-colors',
                      selectedRole === party.role
                        ? 'border-cyan-500/40 bg-cyan-500/5'
                        : 'border-white/07 hover:border-white/15 hover:bg-white/03'
                    )}
                  >
                    <p className="text-sm font-medium text-slate-200">{party.label}</p>
                    <p className="text-xs text-slate-500">{party.orgs.slice(0, 2).join(', ')}…</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Select org */}
            {step === 2 && selectedParty && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-300">← Back</button>
                  <p className="text-sm font-medium text-slate-300">Select {selectedParty.label}</p>
                </div>
                {selectedParty.orgs.map((org) => (
                  <button
                    key={org}
                    onClick={() => { setSelectedOrg(org); setStep(3); }}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-colors',
                      selectedOrg === org
                        ? 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400'
                        : 'border-white/07 text-slate-300 hover:border-white/15 hover:bg-white/03'
                    )}
                  >
                    {org}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-slate-300">← Back</button>
                  <p className="text-sm font-medium text-slate-300">Confirm transfer details</p>
                </div>

                {/* Arrow summary */}
                <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg text-sm">
                  <div>
                    <p className="text-slate-400 text-xs">From</p>
                    <p className="text-slate-200 font-medium">{shipment.currentCustodian}</p>
                  </div>
                  <ArrowRight size={16} className="text-cyan-400 mx-2 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs">To</p>
                    <p className="text-cyan-400 font-semibold">{selectedOrg}</p>
                    <p className="text-xs text-slate-500 capitalize">{selectedRole && ROLE_LABELS[selectedRole]}</p>
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Temperature at handover (°C)</label>
                  <div className="flex items-center gap-2">
                    <Thermometer size={14} className="text-slate-500" />
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="flex-1 bg-slate-800 border border-white/07 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Seal condition, remarks…"
                    className="w-full bg-slate-800 border border-white/07 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40 resize-none"
                  />
                </div>

                <div className="p-3 bg-violet-500/5 border border-violet-500/20 rounded-lg text-xs text-slate-400">
                  <p className="font-medium text-violet-400 mb-1">Blockchain event will be created</p>
                  <p>This transfer will be permanently recorded on the blockchain. Current timestamp and location will be captured.</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  className="w-full justify-center"
                >
                  Confirm & Transfer Custody
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
