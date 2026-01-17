/**
 * Examples: Using the Database with Components
 * See DATABASE.md and SQLITE_QUICKSTART.md for complete documentation
 */

import {
  saveNetworkTest,
  getLatestTestResults,
  getTestStatistics,
} from '@/src/server/db';

// Example 1: Save a test result
export function exampleSaveTest() {
  saveNetworkTest({
    hostname: 'google.com',
    timestamp: new Date().toISOString(),
    latency: 18,
    jitter: 2.5,
    packetLoss: 0,
    minLatency: 15,
    maxLatency: 30,
    status: 'success',
  });
}

// Example 2: Get latest results
export function exampleGetResults() {
  const allResults = getLatestTestResults();
  const googleResults = getLatestTestResults('google.com');

  return { allResults, googleResults };
}

// Example 3: Get statistics
export function exampleGetStats() {
  return getTestStatistics('google.com');
}