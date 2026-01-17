'use client';

import type { ReactNode } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface HistoricalDataPoint {
  timestamp: string;
  time: string;
  ping?: number;
  latency?: number;
  jitter?: number;
  packetLoss?: number;
}

interface HistoricalChartProps {
  data: Array<HistoricalDataPoint>;
  title: string;
  metric: 'ping' | 'latency' | 'jitter' | 'packetLoss';
  unit: string;
  color: string;
}

export function HistoricalChart({
  data,
  title,
  metric,
  unit,
  color,
}: HistoricalChartProps): ReactNode {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No historical data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: unit, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => [
              `${value.toFixed(2)} ${unit}`,
              title,
            ]}
            labelFormatter={(label: string) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey={metric}
            stroke={color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Min
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.min(...data.map((d: HistoricalDataPoint) => d[metric as keyof HistoricalDataPoint] as number || 0)).toFixed(2)} {unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Avg
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(data.reduce((sum: number, d: HistoricalDataPoint) => sum + (d[metric as keyof HistoricalDataPoint] as number || 0), 0) / data.length).toFixed(2)} {unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Max
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.max(...data.map((d: HistoricalDataPoint) => d[metric as keyof HistoricalDataPoint] as number || 0)).toFixed(2)} {unit}
          </p>
        </div>
      </div>
    </div>
  );
}
