# Getting Started Checklist

## ✅ Completed

- [x] Database layer implemented (`src/server/db.ts`)
- [x] Test scheduler created (`src/actions/testScheduler.ts`)
- [x] API routes for test results (`/api/test-results`)
- [x] API route to trigger tests (`/api/run-tests`)
- [x] Data storage in `.data/` directory
- [x] Type definitions updated
- [x] Build passes with zero errors
- [x] All tests pass (40/40)
- [x] Documentation created (3 guides)
- [x] `.gitignore` updated for `.data/`

## Next Steps for Your Project

### Step 1: Initialize Scheduled Tests (Required)
Choose your hosts to monitor and schedule them:

```typescript
// Option A: In a server action
import { scheduleTest } from '@/src/server/db';

export async function initializeSchedules() {
  scheduleTest('google.com', 5);
  scheduleTest('cloudflare.com', 5);
  scheduleTest('amazon.com', 5);
  scheduleTest('your-api.example.com', 5);
}
```

```bash
# Option B: Via API
curl -X POST http://localhost:3000/api/run-tests \
  -H "Content-Type: application/json" \
  -d '{"action": "run-tests", "hosts": ["google.com", "cloudflare.com"]}'
```

### Step 2: Set Up Periodic Testing (Required)

Choose one method:

#### Method A: External Cron Service (Recommended for Cloud)
1. Sign up at [EasyCron](https://www.easycron.com/) or similar
2. Create a cron job:
   - URL: `https://yourapp.vercel.app/api/run-tests?action=run-scheduled`
   - Frequency: Every 5 minutes
3. Done! Tests will run automatically

#### Method B: Node Cron (For Self-Hosted)
```bash
npm install node-cron
```

Create `src/lib/scheduler.ts`:
```typescript
import cron from 'node-cron';
import { runScheduledTests } from '@/src/actions/testScheduler';

export function initializeScheduler() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running scheduled tests...');
    const result = await runScheduledTests();
    console.log(`Executed: ${result.executed}, Failed: ${result.failed}`);
  });

  console.log('Scheduler initialized');
}
```

Initialize in `app/layout.tsx`:
```typescript
import { initializeScheduler } from '@/src/lib/scheduler';

export default function RootLayout({ children }) {
  // Server-side only
  if (typeof window === 'undefined') {
    initializeScheduler();
  }

  return <html><body>{children}</body></html>;
}
```

#### Method C: Vercel Crons (Serverless)
1. Create `app/api/cron/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { runScheduledTests } from '@/src/actions/testScheduler';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runScheduledTests();
  return NextResponse.json(result);
}
```

2. Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron",
    "schedule": "*/5 * * * *"
  }]
}
```

3. Set environment variable:
```bash
vercel env add CRON_SECRET <random_secret>
```

### Step 3: Update Dashboard Component (Optional)

Replace mock data with real database results:

```typescript
// app/(authenticated)/dashboard/page.tsx
import { getLatestTestResults, getTestStatistics } from '@/src/server/db';

async function Dashboard() {
  const results = getLatestTestResults();
  const stats = getTestStatistics();

  return (
    <div>
      <h1>Network Monitoring Dashboard</h1>
      
      {/* Display metrics from database */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p>Average Ping</p>
          <p className="text-2xl font-bold">{stats.avgPing.toFixed(1)}ms</p>
        </div>
        <div>
          <p>Average Latency</p>
          <p className="text-2xl font-bold">{stats.avgLatency.toFixed(1)}ms</p>
        </div>
        <div>
          <p>Average Jitter</p>
          <p className="text-2xl font-bold">{stats.avgJitter.toFixed(2)}ms</p>
        </div>
        <div>
          <p>Test Results</p>
          <p className="text-2xl font-bold">{stats.testCount}</p>
        </div>
      </div>

      {/* Display latest test results */}
      <table>
        <thead>
          <tr>
            <th>Host</th>
            <th>Ping</th>
            <th>Latency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.hostname}>
              <td>{result.hostname}</td>
              <td>{result.ping.toFixed(1)}ms</td>
              <td>{result.latency.toFixed(1)}ms</td>
              <td>{result.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
```

### Step 4: Add Real-Time Monitoring (Optional)

Create a client component that polls the API:

```typescript
// components/LiveMonitor.tsx
'use client';

import { useEffect, useState } from 'react';
import type { NetworkTestResult } from '@/src/types/network';

export function LiveMonitor() {
  const [results, setResults] = useState<NetworkTestResult[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch('/api/test-results?limit=10');
      const data = await response.json();
      setResults(data);
      setLastUpdate(new Date());
    };

    // Fetch immediately
    fetchResults();

    // Poll every 30 seconds
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Test Results</h2>
      {lastUpdate && <p>Updated: {lastUpdate.toLocaleTimeString()}</p>}
      
      <div className="space-y-2">
        {results.map(result => (
          <div key={result.hostname} className="border p-4 rounded">
            <h3>{result.hostname}</h3>
            <p>Ping: {result.ping.toFixed(1)}ms</p>
            <p>Status: {result.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 5: Monitor Data Directory (Optional)

Set up automated cleanup for old data:

```typescript
// In your cron job or scheduled task
import { deleteOldResults } from '@/src/server/db';

// Keep last 30 days of data
const deletedCount = deleteOldResults(30);
console.log(`Deleted ${deletedCount} old test results`);
```

### Step 6: Backup Strategy (Optional)

Create regular backups:

```bash
# Manual backup
cp -r .data .data.backup.$(date +%Y%m%d-%H%M%S)

# Or in a script
#!/bin/bash
mkdir -p backups
cp -r .data backups/data.backup.$(date +%Y%m%d-%H%M%S)
# Keep only last 10 backups
ls -t backups/ | tail -n +11 | xargs -r rm -rf
```

## Verification Steps

### 1. Check Database is Working
```typescript
import { getLatestTestResults } from '@/src/server/db';

const results = getLatestTestResults();
console.log('Database test results:', results);
```

### 2. Verify API Routes
```bash
# Test API
curl http://localhost:3000/api/test-results?limit=1

# Should return array of results or empty array []
```

### 3. Check Data Files
```bash
# Verify .data directory exists
ls -la .data/

# Should show:
# - network_tests.json
# - test_schedules.json
```

### 4. Run Tests
```bash
npm test
# Should show: Tests: 40 passed, 40 total
```

## Troubleshooting

### Tests not saving?
```typescript
import { saveNetworkTest } from '@/src/server/db';
import { performNetworkTest } from '@/src/server/network';

const result = await performNetworkTest('google.com');
console.log('Test result:', result);
saveNetworkTest(result);
```

### Data directory not created?
```bash
# Create manually
mkdir -p .data
chmod 755 .data

# Verify
ls -la .data/
```

### Scheduled tests not running?
```typescript
import { getScheduledTests, runScheduledTests } from '@/src/server/db';

// Check if schedules exist
const schedules = getScheduledTests();
console.log('Schedules:', schedules);

// Try running manually
const result = await runScheduledTests();
console.log('Result:', result);
```

## Quick Reference

### Key Files
- `src/server/db.ts` - Database operations
- `src/actions/testScheduler.ts` - Test execution
- `app/api/test-results/route.ts` - Results API
- `app/api/run-tests/route.ts` - Test trigger API
- `.data/network_tests.json` - Test data storage
- `.data/test_schedules.json` - Schedule storage

### Key Functions
```typescript
// Database
import { 
  saveNetworkTest,
  getLatestTestResults,
  getTestStatistics,
  scheduleTest,
  getScheduledTests,
  deleteOldResults,
} from '@/src/server/db';

// Testing
import {
  runScheduledTests,
  runTestsForHosts,
} from '@/src/actions/testScheduler';
```

### API Endpoints
- `GET /api/test-results` - Fetch results
- `POST /api/test-results` - Save result
- `POST /api/run-tests` - Trigger tests
- `GET /api/run-tests?action=run-scheduled` - Trigger from webhook

## Documentation

Read these in order:
1. **SQLITE_QUICKSTART.md** - 5-minute overview
2. **DATABASE.md** - Complete reference
3. **IMPLEMENTATION_SUMMARY.md** - Technical details
4. **This file** - Getting started checklist

## Support

If you get stuck:
1. Check [DATABASE.md](./DATABASE.md) troubleshooting section
2. Review [SQLITE_QUICKSTART.md](./SQLITE_QUICKSTART.md) examples
3. Look at test files in `app/*.test.tsx`
4. Check API route implementations in `app/api/*/route.ts`

## Success Criteria

You'll know it's working when:
- ✅ `.data/` directory exists with JSON files
- ✅ Running `/api/run-tests` populates test data
- ✅ Dashboard displays real metrics (not mock data)
- ✅ Periodic cron job runs automatically every 5 minutes
- ✅ Old data is automatically cleaned up

## Ready to Deploy?

Before deploying to production:
1. [ ] Choose periodic testing method (cron, node-cron, or Vercel)
2. [ ] Test data persistence with `npm test`
3. [ ] Verify API routes work
4. [ ] Check `.data/` permissions
5. [ ] Set up backup strategy
6. [ ] Monitor disk usage
7. [ ] Plan migration to PostgreSQL if needed

Good luck! 🚀
