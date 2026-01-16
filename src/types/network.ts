export type StatusType = 'good' | 'warning' | 'critical' | 'success' | 'error';

export interface MetricCard {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  status: StatusType;
}

export interface NetworkTest {
  timestamp: string;
  ping: number;
  latency: number;
  jitter: number;
  bandwidth: number;
  status: 'success' | 'warning' | 'error';
}

export interface NetworkTestResult {
  hostname: string;
  timestamp: string;
  ping: number;
  latency: number;
  jitter: number;
  packetLoss: number;
  status: 'success' | 'warning' | 'error';
  minLatency: number;
  maxLatency: number;
  id?: number;
  created_at?: string;
}

export interface StatisticsSummary {
  label: string;
  value: string;
  unit?: string;
  trend: number;
  trendLabel: string;
}
