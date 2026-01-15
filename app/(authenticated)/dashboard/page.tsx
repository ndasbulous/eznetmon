'use client';

import type { ReactNode } from 'react';
import { Activity, Zap, TrendingUp, Wifi } from 'lucide-react';
import { MetricCard } from '@/src/components/MetricCard';
import { NetworkTestsTable } from '@/src/components/NetworkTestsTable';
import { StatisticsSummary } from '@/src/components/StatisticsSummary';
import type { MetricCard as MetricCardType, NetworkTest, StatisticsSummary as StatisticsSummaryType } from '@/src/types/network';

const mockMetrics: Array<MetricCardType> = [
  {
    label: 'Ping',
    value: '24',
    unit: 'ms',
    icon: <Zap className="w-6 h-6" />,
    status: 'good',
  },
  {
    label: 'Latency',
    value: '18',
    unit: 'ms',
    icon: <Activity className="w-6 h-6" />,
    status: 'good',
  },
  {
    label: 'Jitter',
    value: '2.5',
    unit: 'ms',
    icon: <TrendingUp className="w-6 h-6" />,
    status: 'good',
  },
  {
    label: 'Bandwidth',
    value: '450',
    unit: 'Mbps',
    icon: <Wifi className="w-6 h-6" />,
    status: 'good',
  },
];

const mockNetworkTests: Array<NetworkTest> = [
  {
    timestamp: '2024-01-16 14:30:00',
    ping: 24,
    latency: 18,
    jitter: 2.5,
    bandwidth: 450,
    status: 'success',
  },
  {
    timestamp: '2024-01-16 14:25:00',
    ping: 26,
    latency: 19,
    jitter: 3.1,
    bandwidth: 445,
    status: 'success',
  },
  {
    timestamp: '2024-01-16 14:20:00',
    ping: 28,
    latency: 21,
    jitter: 3.8,
    bandwidth: 440,
    status: 'warning',
  },
  {
    timestamp: '2024-01-16 14:15:00',
    ping: 23,
    latency: 17,
    jitter: 2.2,
    bandwidth: 455,
    status: 'success',
  },
  {
    timestamp: '2024-01-16 14:10:00',
    ping: 25,
    latency: 18,
    jitter: 2.6,
    bandwidth: 452,
    status: 'success',
  },
];

const mockStatistics: Array<StatisticsSummaryType> = [
  {
    label: 'Average Ping',
    value: '25.2',
    unit: 'ms',
    trend: -2,
    trendLabel: 'from yesterday',
  },
  {
    label: 'Average Latency',
    value: '18.6',
    unit: 'ms',
    trend: -1.5,
    trendLabel: 'from yesterday',
  },
  {
    label: 'Average Bandwidth',
    value: '448.4',
    unit: 'Mbps',
    trend: 1.2,
    trendLabel: 'from yesterday',
  },
];

export default function DashboardPage(): ReactNode {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Network Quality Monitor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time monitoring of network performance metrics
        </p>
      </section>

      {/* Metric Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Current Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockMetrics.map((metric: MetricCardType) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      {/* Network Tests History Table */}
      <NetworkTestsTable tests={mockNetworkTests} />

      {/* Statistics Summary */}
      <StatisticsSummary statistics={mockStatistics} />
    </div>
  );
}
