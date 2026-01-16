/**
 * Examples: Using the Database with Components
 * See DATABASE.md and SQLITE_QUICKSTART.md for complete documentation
 */

import type { NetworkTestResult } from '@/src/types/network';

// Example 1: Save a test result
export function exampleSaveTest() {
  const saveNetworkTest = require('@/src/server/db').saveNetworkTest;
  
  saveNetworkTest({
    hostname: 'google.com',
    timestamp: new Date().toISOString(),
    ping: 24,
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
  const getLatestTestResults = require('@/src/server/db').getLatestTestResults;
  
  const allResults = getLatestTestResults();
  const googleResults = getLatestTestResults('google.com');
  
  return { allResults, googleResults };
}

// Example 3: Get statistics
export function exampleGetStats() {
  const getTestStatistics = require('@/src/server/db').getTestStatistics;
  
  const stats = getTestStatistics('google.com');
  return stats;
  // Returns: { avgPing, minPing, maxPing, avgLatency, avgJitter, avgPacketLoss, testCount }
}

// Example 4: Schedule tests
export function exampleScheduleTests() {
  const scheduleTest = require('@/src/server/db').scheduleTest;
  
  scheduleTest('google.com', 5);    // Every 5 minutes
  scheduleTest('cloudflare.com', 5);
  scheduleTest('amazon.com', 5);
}

// Example 5: Run scheduled tests
export async function exampleRunTests() {
  const runScheduledTests = require('@/src/actions/testScheduler').runScheduledTests;
  
  const result = await runScheduledTests();
  console.log(`Executed: ${result.executed}, Failed: ${result.failed}`);
  return result;
}

// Example 6: API usage
export function exampleApiUsage() {
  return `
  // Save test result
  POST /api/test-results
  {
    "hostname": "google.com",
    "timestamp": "2024-01-16T14:30:00Z",
    "ping": 24,
    "latency": 18,
    "jitter": 2.5,
    "packetLoss": 0,
    "status": "success"
  }
  
  // Get results
  GET /api/test-results?hostname=google.com&limit=50
  
  // Get statistics
  GET /api/test-results?stats=true&hostname=google.com
  
  // Run tests
  POST /api/run-tests
  { "action": "run-scheduled" }
  `;
}

// See DATABASE.md for complete documentation
