export interface NetworkTest {
  timestamp: string;
  ping: number;
  latency: number;
  jitter: number;
  bandwidth: number;
  status: 'success' | 'warning' | 'error';
}
