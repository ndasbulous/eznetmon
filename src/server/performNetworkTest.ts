import type { NetworkTestResult } from '@/src/types/network';
import { calculateJitter } from './calculateJitter';
import { calculatePacketLoss } from './calculatePacketLoss';
import { performSimplePing } from './performSimplePing';

/**
 * Perform a series of ping tests to a hostname
 * Returns latency metrics: min, max, avg, and jitter
 */
export async function performNetworkTest(
  hostname: string,
  numberOfPings: number = 5,
  timeout: number = 5000
): Promise<NetworkTestResult> {
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
