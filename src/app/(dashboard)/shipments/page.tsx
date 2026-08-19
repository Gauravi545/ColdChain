'use client';
import { useQuery } from '@tanstack/react-query';
import { getShipments } from '@/lib/services/api';
import { useAuth } from '@/lib/auth/context';
import { ShipmentTable } from '@/components/shipments/ShipmentTable';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { canRegisterShipment } from '@/lib/permissions';

export default function ShipmentsPage() {
  const { role } = useAuth();

  const { data: shipments, isLoading, error, refetch } = useQuery({
    queryKey: ['shipments', role],
    queryFn: () => getShipments({}, role ?? undefined),
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Shipments</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {role === 'admin' ? 'All shipments across the network' : 'Shipments assigned to your organization'}
          </p>
        </div>
        {role && canRegisterShipment(role) && (
          <Link href="/shipments/new">
            <Button icon={<Package size={14} />} size="md">
              Register Shipment
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Loading shipments…" />
      ) : error ? (
        <ErrorState message="Failed to load shipments" onRetry={refetch} />
      ) : (
        <ShipmentTable shipments={shipments ?? []} showFilters />
      )}
    </div>
  );
}
