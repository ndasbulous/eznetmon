'use server';

import { performNetworkTest } from '@/src/server/network';
import {
  getScheduledTests,
  updateLastRun,
  saveNetworkTest,
  getLatestTestResults,
} from '@/src/server/db';
import type { NetworkTestResult } from '@/src/types/network';

const DEFAULT_HOSTS = ['google.com', 'cloudflare.com', 'amazon.com'];

interface ScheduledTestJob {
  id: number;
  hostname: string;
  interval_minutes: number;
  is_active: boolean;
  last_run: string | null;
}

function shouldRunTest(job: ScheduledTestJob): boolean {
  if (!job.is_active) {
    return false;
  }

  if (!job.last_run) {
    // Never run before, should run
    return true;
  }

  const lastRunTime = new Date(job.last_run).getTime();
  const now = new Date().getTime();
  const intervalMs = job.interval_minutes * 60 * 1000;

  return now - lastRunTime >= intervalMs;
}

export async function runScheduledTests(): Promise<{
  executed: number;
  failed: number;
  results: NetworkTestResult[];
}> {
  try {
    const scheduledTests = getScheduledTests(true);

    if (scheduledTests.length === 0) {
      // If no scheduled tests, initialize with defaults
      console.log('No scheduled tests found. Running tests for default hosts:', DEFAULT_HOSTS);
      return await runTestsForHosts(DEFAULT_HOSTS);
    }

    let executed = 0;
    let failed = 0;
    const results: NetworkTestResult[] = [];

    for (const job of scheduledTests) {
      if (!shouldRunTest(job)) {
        console.log(`Skipping ${job.hostname} - not due yet`);
        continue;
      }

      try {
        console.log(`Running test for ${job.hostname}`);
        const result = await performNetworkTest(job.hostname);

        saveNetworkTest({
          ...result,
          status: result.status,
        });

        results.push(result);
        updateLastRun(job.hostname);
        executed++;

        console.log(`Test completed for ${job.hostname}:`, result);
      } catch (error) {
        failed++;
        console.error(`Test failed for ${job.hostname}:`, error);

        // Save error result
        const timestamp = new Date().toISOString();
        saveNetworkTest({
          hostname: job.hostname,
          timestamp,
          ping: 0,
          latency: 0,
          jitter: 0,
          packetLoss: 100,
          minLatency: 0,
          maxLatency: 0,
          status: 'error',
        });

        updateLastRun(job.hostname);
      }
    }

    return { executed, failed, results };
  } catch (error) {
    console.error('Error running scheduled tests:', error);
    throw error;
  }
}

export async function runTestsForHosts(
  hosts: string[]
): Promise<{
  executed: number;
  failed: number;
  results: NetworkTestResult[];
}> {
  let executed = 0;
  let failed = 0;
  const results: NetworkTestResult[] = [];

  for (const hostname of hosts) {
    try {
      console.log(`Running test for ${hostname}`);
      const result = await performNetworkTest(hostname);

      saveNetworkTest({
        ...result,
        status: result.status,
      });

      results.push(result);
      executed++;

      console.log(`Test completed for ${hostname}:`, result);
    } catch (error) {
      failed++;
      console.error(`Test failed for ${hostname}:`, error);

      // Save error result
      const timestamp = new Date().toISOString();
      saveNetworkTest({
        hostname,
        timestamp,
        ping: 0,
        latency: 0,
        jitter: 0,
        packetLoss: 100,
        minLatency: 0,
        maxLatency: 0,
        status: 'error',
      });
    }
  }

  return { executed, failed, results };
}

export async function getTestResultsFromDb(
  hostname?: string,
  limit: number = 100
): Promise<NetworkTestResult[]> {
  try {
    // For now, return latest results
    // In production, you'd want to fetch with pagination
    const results = getLatestTestResults(hostname);
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
}
