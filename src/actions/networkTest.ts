'use server';

import { performNetworkTest } from '@/src/server/network';
import type { NetworkTestResult } from '@/src/types/network';

/**
 * Server action to perform a network test to a specific hostname
 * This runs on the server and returns network metrics
 */
export async function testNetworkLatency(
  hostname: string,
  numberOfPings: number = 5
): Promise<NetworkTestResult> {
  // Validate input
  if (!hostname || typeof hostname !== 'string') {
    throw new Error('Invalid hostname');
  }

  const trimmedHostname = hostname.trim();

  if (trimmedHostname.length === 0) {
    throw new Error('Hostname cannot be empty');
  }

  // Prevent SSRF attacks - validate hostname format
  if (!isValidHostname(trimmedHostname)) {
    throw new Error('Invalid hostname format');
  }

  // Limit number of pings to prevent abuse
  const safePings = Math.min(Math.max(1, numberOfPings), 10);

  try {
    const result = await performNetworkTest(trimmedHostname, safePings, 5000);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Server action failed: ${errorMessage}`);

    return {
      hostname: trimmedHostname,
      timestamp: new Date().toISOString(),
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
 * Validate hostname format to prevent SSRF attacks
 */
function isValidHostname(hostname: string): boolean {
  // Must be a valid domain or IP address
  const hostnameRegex =
    /^(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/i;

  return hostnameRegex.test(hostname) && !hostname.includes('localhost');
}
