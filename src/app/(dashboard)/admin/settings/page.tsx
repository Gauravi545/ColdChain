'use client';
import { Settings, Server, Shield, Globe, Database } from 'lucide-react';
import { API_URL, WS_URL, BLOCKCHAIN_EXPLORER_URL } from '@/lib/constants';

export default function SettingsPage() {
  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Environment configuration and platform parameters</p>
      </div>

      {/* Environment config */}
      <div className="glass-card border border-white/07 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server size={16} className="text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200">Environment Configuration</h2>
          <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            Mock Mode
          </span>
        </div>
        <div className="space-y-3">
          {[
            { key: 'NEXT_PUBLIC_API_URL', value: API_URL, icon: <Globe size={13} /> },
            { key: 'NEXT_PUBLIC_WS_URL', value: WS_URL, icon: <Database size={13} /> },
            { key: 'NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL', value: BLOCKCHAIN_EXPLORER_URL, icon: <Shield size={13} /> },
          ].map(({ key, value, icon }) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
              <span className="text-slate-500 shrink-0">{icon}</span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-mono">{key}</p>
                <p className="text-sm text-slate-200 font-mono truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-4">
          Configure these values in <code className="text-slate-500">.env.local</code> to connect to a real backend.
        </p>
      </div>

      {/* Platform info */}
      <div className="glass-card border border-white/07 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200">Platform Information</h2>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ['Platform', 'ColdChain Provenance Platform'],
            ['Version', '1.0.0 (Frontend Layer 5)'],
            ['Blockchain Network', 'Configurable (Polygon / Hyperledger Fabric)'],
            ['IoT Protocol', 'ESP32 → Backend → WebSocket'],
            ['Data Storage', 'Backend + Blockchain (not frontend)'],
            ['Authentication', 'Demo mode (JWT-ready)'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2 border-b border-white/03">
              <span className="text-slate-500">{k}</span>
              <span className="text-slate-300 text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
