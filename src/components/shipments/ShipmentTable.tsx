'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Shipment, ShipmentFilters } from '@/types';
import { formatTemp, formatRelative } from '@/lib/utils';
import { ShipmentStatusBadge, TemperatureBadge, SensorStatusBadge } from '@/components/shipments/ShipmentStatusBadge';
import { Search, Filter, Package, ChevronRight, Thermometer, MapPin } from 'lucide-react';
import { EmptyState } from '@/components/ui/States';

interface ShipmentTableProps {
  shipments: Shipment[];
  onFilterChange?: (filters: ShipmentFilters) => void;
  showFilters?: boolean;
}

export function ShipmentTable({ shipments, showFilters = true }: ShipmentTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [breachFilter, setBreachFilter] = useState('');

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.id.toLowerCase().includes(q) && !s.product.toLowerCase().includes(q) && !s.currentCustodian.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && s.status !== statusFilter) return false;
      if (conditionFilter && s.temperatureCondition !== conditionFilter) return false;
      if (breachFilter === 'yes' && !s.hasActiveBreach) return false;
      if (breachFilter === 'no' && s.hasActiveBreach) return false;
      return true;
    });
  }, [shipments, search, statusFilter, conditionFilter, breachFilter]);

  return (
    <div className="glass-card border border-white/07 overflow-hidden">
      {showFilters && (
        <div className="px-4 py-3 border-b border-white/05 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search shipment, product, custodian…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/07 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <Filter size={14} />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800/50 border border-white/07 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">All Statuses</option>
            <option value="registered">Registered</option>
            <option value="in_transit">In Transit</option>
            <option value="at_distributor">At Distributor</option>
            <option value="delivered">Delivered</option>
            <option value="on_hold">On Hold</option>
            <option value="recalled">Recalled</option>
          </select>

          {/* Condition filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-slate-800/50 border border-white/07 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">All Conditions</option>
            <option value="safe">Safe</option>
            <option value="warning">Warning</option>
            <option value="breach">Breach</option>
          </select>

          {/* Breach filter */}
          <select
            value={breachFilter}
            onChange={(e) => setBreachFilter(e.target.value)}
            className="bg-slate-800/50 border border-white/07 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">Any Breach Status</option>
            <option value="yes">Active Breach</option>
            <option value="no">No Breach</option>
          </select>

          <span className="text-xs text-slate-500 ml-auto">{filtered.length} shipments</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={32} />}
          title="No shipments found"
          message="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/05">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Shipment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Temperature</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Custodian</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Sensor</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((shipment) => (
                <tr key={shipment.id} className="border-b border-white/03 table-row-hover group">
                  <td className="px-4 py-3">
                    <Link href={`/shipments/${shipment.id}`} className="block">
                      <div className="flex items-center gap-2">
                        {shipment.hasActiveBreach && (
                          <div className="w-2 h-2 rounded-full bg-red-500 breach-pulse shrink-0" />
                        )}
                        <div>
                          <p className="font-mono text-xs text-cyan-400">{shipment.id}</p>
                          <p className="text-sm font-medium text-slate-200 truncate max-w-[180px]">{shipment.product}</p>
                          <p className="text-xs text-slate-500">{shipment.productType}</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Thermometer size={12} className={shipment.temperatureCondition === 'breach' ? 'text-red-400' : shipment.temperatureCondition === 'warning' ? 'text-amber-400' : 'text-emerald-400'} />
                        <span className={`text-sm font-semibold font-mono ${shipment.temperatureCondition === 'breach' ? 'text-red-400' : shipment.temperatureCondition === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {formatTemp(shipment.currentTemperature)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">Range: {shipment.safeTemperatureRange.min}–{shipment.safeTemperatureRange.max}°C</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-slate-300">{shipment.currentCustodian}</p>
                    <p className="text-xs text-slate-500 capitalize">{shipment.currentCustodianRole}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-600 shrink-0" />
                      <span className="text-xs text-slate-400 truncate max-w-[140px]">{shipment.currentLocation.label}</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-4">{formatRelative(shipment.currentLocation.timestamp)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ShipmentStatusBadge status={shipment.status} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <SensorStatusBadge status={shipment.sensorStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/shipments/${shipment.id}`}>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </Link>
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
