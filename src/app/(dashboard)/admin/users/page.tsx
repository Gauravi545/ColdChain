'use client';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/services/api';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { canManageUsers } from '@/lib/permissions';
import { LoadingState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import { ROLE_LABELS } from '@/lib/constants';
import { formatRelative } from '@/lib/utils';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-violet-400 bg-violet-500/10',
  manufacturer: 'text-cyan-400 bg-cyan-500/10',
  transporter: 'text-amber-400 bg-amber-500/10',
  distributor: 'text-blue-400 bg-blue-500/10',
  retailer: 'text-emerald-400 bg-emerald-500/10',
};

export default function UsersPage() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role && !canManageUsers(role)) router.push('/dashboard');
  }, [role, router]);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage platform users and their roles</p>
        </div>
        <Button icon={<UserPlus size={14} />} size="sm">Invite User</Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="glass-card border border-white/07 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/05">
                {['User', 'Role', 'Organization', 'Last Active', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-white/03 table-row-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', ROLE_COLORS[user.role])}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">{ROLE_LABELS[user.role]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.organization}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatRelative(user.lastActive)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isActive ? 'safe' : 'offline'} size="sm" dot>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
