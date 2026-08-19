'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/constants';
import { Thermometer, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_ROLES: { role: UserRole; label: string; org: string; color: string; description: string }[] = [
  {
    role: 'admin',
    label: 'Administrator',
    org: 'ColdChain Platform',
    color: 'border-violet-500/40 hover:border-violet-400 bg-violet-500/5',
    description: 'Full platform visibility, all shipments, all alerts, user management',
  },
  {
    role: 'manufacturer',
    label: 'Manufacturer',
    org: 'BioPharm India Ltd.',
    color: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/5',
    description: 'Register shipments, monitor provenance, initiate handovers',
  },
  {
    role: 'transporter',
    label: 'Transporter',
    org: 'XYZ Logistics',
    color: 'border-amber-500/40 hover:border-amber-400 bg-amber-500/5',
    description: 'View assigned shipments, sensor status, accept & transfer custody',
  },
  {
    role: 'distributor',
    label: 'Distributor',
    org: 'PharmaDist Central',
    color: 'border-blue-500/40 hover:border-blue-400 bg-blue-500/5',
    description: 'Monitor incoming/outgoing, investigate breaches, generate reports',
  },
  {
    role: 'retailer',
    label: 'Retailer',
    org: 'MediRetail Chain',
    color: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/5',
    description: 'Receive shipments, verify provenance, view temperature compliance',
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleLogin = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(selected);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col lg:flex-row">
      {/* Left — branding panel */}
      <div className="lg:w-2/5 flex flex-col justify-center p-10 lg:p-16 relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Thermometer size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">ColdChain</span>
              <p className="text-xs text-slate-500">Provenance Platform</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-100 leading-tight mb-4">
            Blockchain-Enabled<br />
            <span className="gradient-text">Cold Chain</span><br />
            Accountability
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
            Real-time IoT monitoring, tamper-proof chain-of-custody records, and 
            instant provenance verification for pharmaceutical and food cold chains.
          </p>

          {/* Feature chips */}
          <div className="space-y-3">
            {[
              { icon: <Thermometer size={14} />, text: 'Real-time temperature & humidity tracking' },
              { icon: <ShieldCheck size={14} />, text: 'Blockchain-verified custody events' },
              { icon: <Zap size={14} />, text: 'Instant breach accountability' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="text-cyan-400">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-1">Sign in to ColdChain</h2>
            <p className="text-sm text-slate-500">Select a demo role to explore the platform</p>
          </div>

          {/* Role cards */}
          <div className="space-y-2 mb-6">
            {DEMO_ROLES.map((item) => (
              <button
                key={item.role}
                onClick={() => setSelected(item.role)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-all duration-150',
                  item.color,
                  selected === item.role
                    ? 'ring-1 ring-offset-1 ring-offset-transparent ' + item.color.split(' ')[1].replace('hover:', '')
                    : 'border-white/07 bg-transparent hover:bg-white/03'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.org}</p>
                  </div>
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 mt-0.5 transition-all',
                    selected === item.role
                      ? 'border-cyan-400 bg-cyan-400'
                      : 'border-slate-600'
                  )} />
                </div>
                <p className="text-xs text-slate-600 mt-1.5">{item.description}</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
              selected && !loading
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.01]'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in…
              </>
            ) : (
              <>
                Continue as {selected ? ROLE_LABELS[selected] : '…'}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-600 mt-4">
            Demo mode — no real authentication. For public verification:&nbsp;
            <a href="/verify/SHP-1024" className="text-cyan-400 hover:underline">scan a QR code</a>
          </p>
        </div>
      </div>
    </div>
  );
}
