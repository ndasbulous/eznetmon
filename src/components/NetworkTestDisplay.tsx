import type { ReactNode } from 'react';
import { testNetworkLatency } from '@/src/actions/networkTest';
import type { NetworkTestResult } from '@/src/types/network';
import { Activity, AlertCircle } from 'lucide-react';
import { MetricRow } from './MetricRow';
import { getStatusColor, getTextColor } from './statusHelpers';
import { StatusIcon } from './StatusIcon';

interface NetworkTestDisplayProps {
  hostname?: string;
  numberOfPings?: number;
}

export async function NetworkTestDisplay({
  hostname = 'www.detik.com',
  numberOfPings = 10,
}: NetworkTestDisplayProps): Promise<ReactNode> {
  let result: NetworkTestResult | null = null;
  let error: string | null = null;

  try {
    result = await testNetworkLatency(hostname, numberOfPings);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to perform network test';
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Network Test Failed
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <Activity className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">Testing network...</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-6 ${getStatusColor(result.status)} ${getTextColor(
        result.status,
      )}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {StatusIcon(result.status)}
            <h3 className="text-lg font-semibold">
              Network Test Results
            </h3>
          </div>
          <p className="text-sm opacity-75">
            Testing connectivity to{' '}
            <span className="font-mono font-bold">{result.hostname}</span>
          </p>
        </div>
        <span className="text-xs opacity-60">
          {new Date(result.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Latency Card */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs font-medium opacity-75 mb-3">Latency</p>
          <div className="space-y-2">
            <MetricRow label="Average (Ping)" value={result.ping} unit="ms" />
            <MetricRow label="Minimum" value={result.latency} unit="ms" />
            <MetricRow label="Maximum" value={result.maxLatency} unit="ms" />
          </div>
        </div>

        {/* Quality Metrics Card */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs font-medium opacity-75 mb-3">Quality Metrics</p>
          <div className="space-y-2">
            <MetricRow label="Jitter" value={result.jitter} unit="ms" />
            <MetricRow
              label="Packet Loss"
              value={result.packetLoss}
              unit="%"
            />
            <MetricRow
              label="Test Count"
              value={numberOfPings}
              unit="pings"
            />
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="pt-4 border-t border-current/20">
        <div className="flex items-center gap-2">
          {StatusIcon(result.status)}
          <span className="text-sm font-medium capitalize">
            {result.status === 'success'
              ? 'Network connection is stable'
              : result.status === 'warning'
                ? 'Network connection is unstable'
                : 'Network connection failed'}
          </span>
        </div>

        {/* Status Details */}
        {result.status === 'warning' ? (
          <p className="text-xs opacity-75 mt-2">
            Packet loss or high latency detected. Your network may be experiencing
            congestion.
          </p>
        ) : result.status === 'error' ? (
          <p className="text-xs opacity-75 mt-2">
            Unable to connect to the test host. Please check your network
            connection.
          </p>
        ) : null}
      </div>
    </div>
  );
}
