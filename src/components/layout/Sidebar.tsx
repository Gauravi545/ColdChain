'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { getNavigationForRole } from '@/lib/permissions';
import { ROLE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Bell, GitBranch, FileText,
  Users, Settings, LogOut, Thermometer, ChevronLeft, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  Package: <Package size={18} />,
  Bell: <Bell size={18} />,
  GitBranch: <GitBranch size={18} />,
  FileText: <FileText size={18} />,
  Users: <Users size={18} />,
  Settings: <Settings size={18} />,
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-violet-400 bg-violet-500/10',
  manufacturer: 'text-cyan-400 bg-cyan-500/10',
  transporter: 'text-amber-400 bg-amber-500/10',
  distributor: 'text-blue-400 bg-blue-500/10',
  retailer: 'text-emerald-400 bg-emerald-500/10',
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role ? getNavigationForRole(role) : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-white/07',
        collapsed && 'justify-center px-3'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shrink-0">
          <Thermometer size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold gradient-text">ColdChain</span>
            <p className="text-xs text-slate-600">Provenance Platform</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {user && !collapsed && (
        <div className="px-3 py-3 border-b border-white/05">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/03">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', role ? ROLE_COLORS[role] : '')}>
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
              <p className={cn('text-xs', role ? ROLE_COLORS[role].split(' ')[0] : 'text-slate-500')}>
                {role ? ROLE_LABELS[role] : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/05'
              )}
              title={collapsed ? item.label : undefined}
            >
              {ICON_MAP[item.icon]}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/07 space-y-1">
        {!collapsed && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/05 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-400 hover:bg-white/05 transition-colors"
        >
          <ChevronLeft size={14} className={cn('transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg glass-card border border-white/10 text-slate-400"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-900 border-r border-white/07 z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 shrink-0 border-r border-white/07 bg-slate-900/50 backdrop-blur-xl transition-all duration-200',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
