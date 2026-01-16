'use server';

import { getTestResultsFromDb, runScheduledTests } from '@/src/actions/testScheduler';
import { getTestStatistics, getLatestTestResults } from '@/src/server/db';
import type { NetworkTestResult } from '@/src/types/network';

export async function fetchDashboardData() {
  try {
    // Run periodic tests if scheduled
    await runScheduledTests();
    
    // Get latest test results
    const latestResults = getLatestTestResults();
    
    // Get statistics
    const stats = getTestStatistics();
    
    return {
      latestResults,
      stats,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      latestResults: [],
      stats: {
        avgPing: 0,
        minPing: 0,
        maxPing: 0,
        avgLatency: 0,
        avgJitter: 0,
        avgPacketLoss: 0,
        testCount: 0,
      },
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    };
  }
}

export async function fetchTestResultsForHost(hostname: string) {
  try {
    const results = getLatestTestResults(hostname);
    const stats = getTestStatistics(hostname);
    
    return { results, stats, error: null };
  } catch (error) {
    console.error(`Error fetching results for ${hostname}:`, error);
    return { results: [], stats: null, error: error instanceof Error ? error.message : 'Failed to fetch' };
  }
}
