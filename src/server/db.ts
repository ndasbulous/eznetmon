import fs from 'fs';
import path from 'path';
import type { NetworkTestResult } from '@/src/types/network';

// File-based JSON storage for network test results
const dataDir = path.join(process.cwd(), '.data');
const testsFile = path.join(dataDir, 'network_tests.json');
const schedulesFile = path.join(dataDir, 'test_schedules.json');

interface StoredTest extends Omit<NetworkTestResult, 'status'> {
  status: string;
  id: number;
  created_at: string;
}

interface StoredSchedule {
  id: number;
  hostname: string;
  interval_minutes: number;
  is_active: boolean;
  last_run: string | null;
  created_at: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadTestsData(): StoredTest[] {
  ensureDataDir();
  if (fs.existsSync(testsFile)) {
    try {
      return JSON.parse(fs.readFileSync(testsFile, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveTestsData(tests: StoredTest[]): void {
  ensureDataDir();
  fs.writeFileSync(testsFile, JSON.stringify(tests, null, 2), 'utf-8');
}

function loadSchedulesData(): StoredSchedule[] {
  ensureDataDir();
  if (fs.existsSync(schedulesFile)) {
    try {
      return JSON.parse(fs.readFileSync(schedulesFile, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveSchedulesData(schedules: StoredSchedule[]): void {
  ensureDataDir();
  fs.writeFileSync(schedulesFile, JSON.stringify(schedules, null, 2), 'utf-8');
}
function initializeDatabase() {
  // Just ensure data directory exists
  ensureDataDir();
  // Initialize empty files if they don't exist
  if (!fs.existsSync(testsFile)) {
    saveTestsData([]);
  }
  if (!fs.existsSync(schedulesFile)) {
    saveSchedulesData([]);
  }
}

export function getDatabase() {
  initializeDatabase();
  return { close: () => {} };
}

export function saveNetworkTest(test: Omit<NetworkTestResult, 'status'> & { status: string }): void {
  const tests = loadTestsData();
  const id = Math.max(0, ...tests.map(t => t.id || 0)) + 1;
  
  // Check if this hostname+timestamp combo already exists and replace it
  const existingIndex = tests.findIndex(
    t => t.hostname === test.hostname && t.timestamp === test.timestamp
  );
  
  const newTest: StoredTest = {
    ...test,
    id: existingIndex >= 0 ? tests[existingIndex].id : id,
    created_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    tests[existingIndex] = newTest;
  } else {
    tests.push(newTest);
  }

  saveTestsData(tests);
}

export function getNetworkTestResults(
  hostname?: string,
  limit: number = 100,
  offset: number = 0
): NetworkTestResult[] {
  const tests = loadTestsData();
  
  let filtered = tests;
  if (hostname) {
    filtered = filtered.filter(t => t.hostname === hostname);
  }

  // Sort by created_at descending, then apply limit/offset
  return filtered
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(offset, offset + limit)
    .map(t => ({
      hostname: t.hostname,
      timestamp: t.timestamp,
      ping: t.ping,
      latency: t.latency,
      jitter: t.jitter,
      packetLoss: t.packetLoss,
      status: t.status as 'success' | 'warning' | 'error',
      minLatency: t.minLatency,
      maxLatency: t.maxLatency,
      id: t.id,
      created_at: t.created_at,
    }));
}

export function getLatestTestResults(hostname?: string): NetworkTestResult[] {
  const tests = loadTestsData();
  
  if (hostname) {
    const filtered = tests.filter(t => t.hostname === hostname);
    if (filtered.length === 0) return [];
    // Return latest one
    const latest = filtered.sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )[0];
    return [{
      hostname: latest.hostname,
      timestamp: latest.timestamp,
      ping: latest.ping,
      latency: latest.latency,
      jitter: latest.jitter,
      packetLoss: latest.packetLoss,
      status: latest.status as 'success' | 'warning' | 'error',
      minLatency: latest.minLatency,
      maxLatency: latest.maxLatency,
      id: latest.id,
      created_at: latest.created_at,
    }];
  }

  // Get latest for each hostname
  const latestByHost = new Map<string, StoredTest>();
  
  tests.forEach(test => {
    const current = latestByHost.get(test.hostname);
    if (!current || new Date(test.created_at || '').getTime() > new Date(current.created_at || '').getTime()) {
      latestByHost.set(test.hostname, test);
    }
  });

  return Array.from(latestByHost.values()).map(t => ({
    hostname: t.hostname,
    timestamp: t.timestamp,
    ping: t.ping,
    latency: t.latency,
    jitter: t.jitter,
    packetLoss: t.packetLoss,
    status: t.status as 'success' | 'warning' | 'error',
    minLatency: t.minLatency,
    maxLatency: t.maxLatency,
    id: t.id,
    created_at: t.created_at,
  }));
}

export function getTestResultsForPeriod(
  startDate: Date,
  endDate: Date,
  hostname?: string
): NetworkTestResult[] {
  const tests = loadTestsData();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return tests
    .filter(test => {
      const testTime = new Date(test.created_at).getTime();
      const matchesTime = testTime >= startTime && testTime <= endTime;
      const matchesHost = !hostname || test.hostname === hostname;
      return matchesTime && matchesHost;
    })
    .map(t => ({
      hostname: t.hostname,
      timestamp: t.timestamp,
      ping: t.ping,
      latency: t.latency,
      jitter: t.jitter,
      packetLoss: t.packetLoss,
      status: t.status as 'success' | 'warning' | 'error',
      minLatency: t.minLatency,
      maxLatency: t.maxLatency,
      id: t.id,
      created_at: t.created_at,
    }));
}

export function getTestStatistics(hostname?: string): {
  avgPing: number;
  minPing: number;
  maxPing: number;
  avgLatency: number;
  avgJitter: number;
  avgPacketLoss: number;
  testCount: number;
} {
  const tests = loadTestsData();
  
  let filtered = tests;
  if (hostname) {
    filtered = filtered.filter(t => t.hostname === hostname);
  }

  if (filtered.length === 0) {
    return {
      avgPing: 0,
      minPing: 0,
      maxPing: 0,
      avgLatency: 0,
      avgJitter: 0,
      avgPacketLoss: 0,
      testCount: 0,
    };
  }

  const avgPing = filtered.reduce((sum, t) => sum + (t.ping || 0), 0) / filtered.length;
  const pings = filtered.map(t => t.ping || 0);
  const minPing = Math.min(...pings);
  const maxPing = Math.max(...pings);
  const avgLatency = filtered.reduce((sum, t) => sum + (t.latency || 0), 0) / filtered.length;
  const avgJitter = filtered.reduce((sum, t) => sum + (t.jitter || 0), 0) / filtered.length;
  const avgPacketLoss = filtered.reduce((sum, t) => sum + (t.packetLoss || 0), 0) / filtered.length;

  return {
    avgPing,
    minPing,
    maxPing,
    avgLatency,
    avgJitter,
    avgPacketLoss,
    testCount: filtered.length,
  };
}

export function scheduleTest(hostname: string, intervalMinutes: number = 5): void {
  const schedules = loadSchedulesData();
  const existingIndex = schedules.findIndex(s => s.hostname === hostname);
  
  const schedule: StoredSchedule = {
    id: existingIndex >= 0 ? schedules[existingIndex].id : Math.max(0, ...schedules.map(s => s.id || 0)) + 1,
    hostname,
    interval_minutes: intervalMinutes,
    is_active: true,
    last_run: existingIndex >= 0 ? schedules[existingIndex].last_run : null,
    created_at: existingIndex >= 0 ? schedules[existingIndex].created_at : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    schedules[existingIndex] = schedule;
  } else {
    schedules.push(schedule);
  }

  saveSchedulesData(schedules);
}

export function getScheduledTests(activeOnly: boolean = true): Array<{
  id: number;
  hostname: string;
  interval_minutes: number;
  is_active: boolean;
  last_run: string | null;
}> {
  const schedules = loadSchedulesData();
  
  let filtered = schedules;
  if (activeOnly) {
    filtered = filtered.filter(s => s.is_active);
  }

  return filtered.map(s => ({
    id: s.id,
    hostname: s.hostname,
    interval_minutes: s.interval_minutes,
    is_active: s.is_active,
    last_run: s.last_run,
  }));
}

export function updateLastRun(hostname: string): void {
  const schedules = loadSchedulesData();
  const schedule = schedules.find(s => s.hostname === hostname);
  
  if (schedule) {
    schedule.last_run = new Date().toISOString();
    saveSchedulesData(schedules);
  }
}

export function deleteOldResults(olderThanDays: number = 30): number {
  const tests = loadTestsData();
  const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  
  const beforeCount = tests.length;
  const filtered = tests.filter(t => new Date(t.created_at).getTime() > cutoffTime);
  
  if (filtered.length < beforeCount) {
    saveTestsData(filtered);
  }

  return beforeCount - filtered.length;
}

export function closeDatabase(): void {
  // No-op for file-based storage
}
