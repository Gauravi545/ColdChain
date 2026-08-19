'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { ROLE_LABELS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '@/lib/services/api';
import { cn } from '@/lib/utils';

export function Topbar() {
  const pathname = usePathname();
  const { user, role } = useAuth();

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getAlerts({ acknowledged: false }),
    refetchInterval: 30000,
  });

  const unreadCount = alerts?.filter((a) => !a.isAcknowledged).length ?? 0;

  // Build breadcrumbs from pathname
  const crumbs = pathname.split('/').filter(Boolean).map((segment, idx, arr) => ({
    label: segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    href: '/' + arr.slice(0, idx + 1).join('/'),
  }));

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/05 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
          Home
        </Link>
        {crumbs.map((crumb, idx) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight size={12} className="text-slate-700" />
            {idx === crumbs.length - 1 ? (
              <span className="text-slate-200 font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-slate-500 hover:text-slate-300 transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Alerts bell */}
        <Link href="/alerts" className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/05 transition-colors">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center breach-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{user.name}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600">{role ? ROLE_LABELS[role] : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
