'use client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Dot,
} from 'recharts';
import { TemperatureReading, SafeTemperatureRange } from '@/types';
import { format } from 'date-fns';

interface TemperatureChartProps {
  readings: TemperatureReading[];
  safeRange: SafeTemperatureRange;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const reading = payload[0]?.payload as TemperatureReading;
  return (
    <div className="glass-card border border-white/10 px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className={`font-bold font-mono ${reading?.isBreach ? 'text-red-400' : 'text-cyan-400'}`}>
        {payload[0]?.value?.toFixed(1)}°C
      </p>
      {reading?.isOfflineSynced && (
        <p className="text-amber-400 mt-0.5">⚡ Offline synced</p>
      )}
      {reading?.isBreach && (
        <p className="text-red-400 mt-0.5">⚠ Temperature Breach</p>
      )}
    </div>
  );
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload?.isBreach) return null;
  return <circle cx={cx} cy={cy} r={4} fill="#ef4444" stroke="#1a0000" strokeWidth={2} />;
};

export function TemperatureChart({ readings, safeRange, height = 280 }: TemperatureChartProps) {
  if (!readings || readings.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
        No temperature data available
      </div>
    );
  }

  const data = readings.map((r) => ({
    ...r,
    time: format(new Date(r.timestamp), 'HH:mm'),
    date: format(new Date(r.timestamp), 'dd MMM HH:mm'),
  }));

  const minTemp = Math.min(...readings.map((r) => r.temperature), safeRange.min) - 1;
  const maxTemp = Math.max(...readings.map((r) => r.temperature), safeRange.max) + 1;

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-3 px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-cyan-400 rounded" />
          <span className="text-slate-500">Temperature</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-emerald-500/60 rounded border-t border-dashed border-emerald-500" />
          <span className="text-slate-500">Safe range ({safeRange.min}–{safeRange.max}°C)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-500">Breach point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 border-t border-dashed border-amber-400" />
          <span className="text-slate-500">Offline synced</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} />

          {/* Safe zone shading */}
          <ReferenceArea
            y1={safeRange.min}
            y2={safeRange.max}
            fill="rgba(16, 185, 129, 0.04)"
            stroke="rgba(16, 185, 129, 0.2)"
            strokeDasharray="4 4"
          />

          {/* Min / Max safe lines */}
          <ReferenceLine
            y={safeRange.max}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{ value: `Max ${safeRange.max}°C`, position: 'right', fill: '#ef4444', fontSize: 10 }}
          />
          <ReferenceLine
            y={safeRange.min}
            stroke="#06b6d4"
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{ value: `Min ${safeRange.min}°C`, position: 'right', fill: '#06b6d4', fontSize: 10 }}
          />

          <XAxis
            dataKey="time"
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minTemp, maxTemp]}
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: '#06b6d4', stroke: '#0b1120', strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
