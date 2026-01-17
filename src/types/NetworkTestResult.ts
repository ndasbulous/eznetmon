export interface NetworkTestResult {
  hostname: string;
  timestamp: string;
  latency: number;
  jitter: number;
  packetLoss: number;
  status: 'success' | 'warning' | 'error';
  minLatency: number;
  maxLatency: number;
  id?: number;
  created_at?: string;
}
