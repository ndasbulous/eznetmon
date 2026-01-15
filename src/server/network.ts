import type { NetworkTestResult } from '@/src/types/network';

export interface PingResult {
  times: Array<number>;
  min: number;
  max: number;
  avg: number;
  stdDev: number;
  packetLoss: number;
}

/**
 * Calculate jitter from ping times
 * Jitter is the standard deviation of latency measurements
 */
export function calculateJitter(times: Array<number>): number {
  if (times.length < 2) {
    return 0;
  }

  const mean = times.reduce((sum: number, time: number) => sum + time, 0) / times.length;
  const variance = times.reduce(
    (sum: number, time: number) => sum + Math.pow(time - mean, 2),
    0
  ) / times.length;

  return Math.sqrt(variance);
}

/**
 * Calculate packet loss percentage
 */
export function calculatePacketLoss(
  totalPackets: number,
  successfulPackets: number
): number {
  if (totalPackets === 0) {
    return 0;
  }

  return ((totalPackets - successfulPackets) / totalPackets) * 100;
}

/**
 * Perform a series of ping tests to a hostname
 * Returns latency metrics: min, max, avg, and jitter
 */
export async function performNetworkTest(
  hostname: string,
  numberOfPings: number = 5,
  timeout: number = 5000
): Promise<NetworkTestResult> {
  const startTime = Date.now();
  const times: Array<number> = [];
  let successfulPings: number = 0;

  try {
    // Validate hostname
    if (!hostname || hostname.trim().length === 0) {
      throw new Error('Invalid hostname provided');
    }

    // Attempt multiple pings
    for (let i = 0; i < numberOfPings; i++) {
      try {
        const pingStartTime = Date.now();

        // Use DNS resolution and TCP connection to estimate latency
        // This is more reliable than ICMP ping in container environments
        const response = await performSimplePing(hostname, timeout);

        if (response !== null) {
          times.push(response);
          successfulPings += 1;
        }
      } catch {
        // Continue with next attempt on failure
        continue;
      }
    }

    // If no successful pings, return error state
    if (times.length === 0) {
      return {
        hostname,
        timestamp: new Date().toISOString(),
        ping: 0,
        latency: 0,
        jitter: 0,
        packetLoss: 100,
        status: 'error',
        minLatency: 0,
        maxLatency: 0,
      };
    }

    const minLatency = Math.min(...times);
    const maxLatency = Math.max(...times);
    const avgLatency = times.reduce((sum: number, time: number) => sum + time, 0) / times.length;
    const jitter = calculateJitter(times);
    const packetLoss = calculatePacketLoss(numberOfPings, successfulPings);

    // Determine status based on metrics
    let status: 'success' | 'warning' | 'error' = 'success';
    if (packetLoss > 25 || avgLatency > 100) {
      status = 'warning';
    }
    if (packetLoss > 50 || avgLatency > 250) {
      status = 'error';
    }

    return {
      hostname,
      timestamp: new Date().toISOString(),
      ping: Math.round(avgLatency * 10) / 10,
      latency: Math.round(minLatency * 10) / 10,
      jitter: Math.round(jitter * 10) / 10,
      packetLoss: Math.round(packetLoss * 10) / 10,
      status,
      minLatency: Math.round(minLatency * 10) / 10,
      maxLatency: Math.round(maxLatency * 10) / 10,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Network test failed for ${hostname}: ${errorMessage}`);

    return {
      hostname,
      timestamp: new Date().toISOString(),
      ping: 0,
      latency: 0,
      jitter: 0,
      packetLoss: 100,
      status: 'error',
      minLatency: 0,
      maxLatency: 0,
    };
  }
}

/**
 * Simple ping implementation using TCP connection attempt
 * Returns latency in milliseconds, or null if connection fails
 */
async function performSimplePing(
  hostname: string,
  timeout: number
): Promise<number | null> {
  return new Promise((resolve: (value: number | null) => void) => {
    const startTime = Date.now();

    // Create a timeout to reject the promise
    const timeoutId = setTimeout(() => {
      resolve(null);
    }, timeout);

    try {
      // Use fetch to a common endpoint like 1.1.1.1 DNS or just measure DNS resolution
      // For most cases, a simple HEAD request works well
      fetch(`https://${hostname}`, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(timeout),
      })
        .then(() => {
          clearTimeout(timeoutId);
          const latency = Date.now() - startTime;
          resolve(latency);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(null);
        });
    } catch {
      clearTimeout(timeoutId);
      resolve(null);
    }
  });
}
