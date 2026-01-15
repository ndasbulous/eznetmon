import type { HistoricalDataPoint } from '@/src/components/HistoricalChart';

/**
 * Mock historical data for network metrics
 * In a real application, this would come from a database
 */
export function generateMockHistoricalData(): Array<HistoricalDataPoint> {
  const data: Array<HistoricalDataPoint> = [];
  const now = new Date();

  // Generate 24 data points for the last 24 hours
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');

    // Generate realistic network metrics with some variation
    const basePing = 20 + Math.random() * 15;
    const jitterVariation = Math.sin(i / 12) * 2;

    data.push({
      timestamp: time.toISOString(),
      time: `${hour}:${minute}`,
      ping: basePing + Math.random() * 10,
      latency: basePing - 5 + Math.random() * 5,
      jitter: Math.max(0.5, 2 + jitterVariation + Math.random() * 2),
      packetLoss: Math.max(0, Math.random() * 5),
    });
  }

  return data;
}

/**
 * Generate mock data for a specific metric for the last N hours
 */
export function generateMockMetricHistory(
  metric: 'ping' | 'latency' | 'jitter' | 'packetLoss',
  hours: number = 24
): Array<HistoricalDataPoint> {
  const data: Array<HistoricalDataPoint> = [];
  const now = new Date();

  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');

    let metricValue: number = 0;

    switch (metric) {
      case 'ping':
        metricValue = 20 + Math.random() * 15;
        break;
      case 'latency':
        metricValue = 15 + Math.random() * 10;
        break;
      case 'jitter':
        metricValue = Math.max(0.5, 2 + Math.random() * 3);
        break;
      case 'packetLoss':
        metricValue = Math.max(0, Math.random() * 5);
        break;
    }

    data.push({
      timestamp: time.toISOString(),
      time: `${hour}:${minute}`,
      [metric]: metricValue,
    });
  }

  return data;
}
