# SQLite Database Integration - Quick Start

## What's New?

Your EZNetMon application now includes a complete database layer for storing and querying network test results. No external database required!

## Key Features

✅ **File-based Storage** - JSON files in `.data/` directory  
✅ **Zero Dependencies** - No Python, C++, or database servers needed  
✅ **Server-side Functions** - Full TypeScript support  
✅ **API Routes** - REST endpoints for test management  
✅ **Periodic Testing** - Schedule automatic network tests  

## Files Added

### Core Database Files
- `src/server/db.ts` - Database operations (save, query, schedule)
- `src/actions/testScheduler.ts` - Periodic test execution
- `src/actions/dashboard.ts` - Dashboard data fetching
- `app/api/test-results/route.ts` - REST API for test results
- `app/api/run-tests/route.ts` - API to trigger tests
- `DATABASE.md` - Complete documentation

### Data Storage
- `.data/network_tests.json` - Stores all test results
- `.data/test_schedules.json` - Stores scheduled test configurations

## Quick Examples

### 1. Save a Test Result

```typescript
import { saveNetworkTest } from '@/src/server/db';

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
```

### 2. Get Latest Test Results

```typescript
import { getLatestTestResults } from '@/src/server/db';

// All hosts
const allResults = getLatestTestResults();

// Specific host
const googleResults = getLatestTestResults('google.com');
```

### 3. Schedule Periodic Tests

```typescript
import { scheduleTest } from '@/src/server/db';

// Schedule test for google.com every 5 minutes
scheduleTest('google.com', 5);
scheduleTest('cloudflare.com', 5);
scheduleTest('amazon.com', 5);
```

### 4. Run Scheduled Tests

```typescript
import { runScheduledTests } from '@/src/actions/testScheduler';

const result = await runScheduledTests();
console.log(`Executed: ${result.executed}, Failed: ${result.failed}`);
```

### 5. Get Statistics

```typescript
import { getTestStatistics } from '@/src/server/db';

const stats = getTestStatistics('google.com');
console.log(`Average ping: ${stats.avgPing}ms`);
console.log(`Min ping: ${stats.minPing}ms`);
console.log(`Max ping: ${stats.maxPing}ms`);
console.log(`Test count: ${stats.testCount}`);
```

## API Endpoints

### Save Test Result
```bash
POST /api/test-results
Content-Type: application/json

{
  "hostname": "google.com",
  "timestamp": "2024-01-16T14:30:00Z",
  "ping": 24,
  "latency": 18,
  "jitter": 2.5,
  "packetLoss": 0,
  "status": "success"
}
```

### Get Test Results
```bash
GET /api/test-results?hostname=google.com&limit=50&offset=0
```

### Get Statistics
```bash
GET /api/test-results?stats=true&hostname=google.com
```

### Run Tests
```bash
POST /api/run-tests
Content-Type: application/json

{
  "action": "run-scheduled"
}

// Or run for specific hosts:
{
  "action": "run-tests",
  "hosts": ["google.com", "cloudflare.com"]
}
```

## Setting Up Periodic Testing

Choose one approach:

### Option A: External Cron Service (EasyCron, Vercel Crons)
Call `/api/run-tests?action=run-scheduled` every 5 minutes

### Option B: Install node-cron
```bash
npm install node-cron
```

Then create `src/lib/scheduler.ts`:
```typescript
import cron from 'node-cron';
import { runScheduledTests } from '@/src/actions/testScheduler';

export function initializeScheduler() {
  cron.schedule('*/5 * * * *', async () => {
    const result = await runScheduledTests();
    console.log(`Tests: ${result.executed} executed, ${result.failed} failed`);
  });
}
```

### Option C: Vercel Crons (Serverless)
Set `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron",
    "schedule": "*/5 * * * *"
  }]
}
```

See [DATABASE.md](./DATABASE.md) for complete setup instructions.

## Data Structure

### Test Result Format
```typescript
interface NetworkTestResult {
  hostname: string;
  timestamp: string; // ISO 8601
  ping: number;      // milliseconds
  latency: number;   // milliseconds
  jitter: number;    // milliseconds
  packetLoss: number;// 0-100
  status: 'success' | 'warning' | 'error';
  minLatency: number;
  maxLatency: number;
  id?: number;
  created_at?: string;
}
```

### Stored Files

**`.data/network_tests.json`** - Test results:
```json
[
  {
    "id": 1,
    "hostname": "google.com",
    "timestamp": "2024-01-16T14:30:00Z",
    "ping": 24,
    "latency": 18,
    "jitter": 2.5,
    "packetLoss": 0,
    "minLatency": 15,
    "maxLatency": 30,
    "status": "success",
    "created_at": "2024-01-16T14:30:00.000Z"
  }
]
```

**`.data/test_schedules.json`** - Scheduled tests:
```json
[
  {
    "id": 1,
    "hostname": "google.com",
    "interval_minutes": 5,
    "is_active": true,
    "last_run": "2024-01-16T14:30:00Z",
    "created_at": "2024-01-16T10:00:00Z"
  }
]
```

## Integration Points

### Dashboard Component
Update `app/(authenticated)/dashboard/page.tsx` to fetch from database:

```typescript
import { fetchDashboardData } from '@/src/actions/dashboard';

async function Dashboard() {
  const { latestResults, stats, error } = await fetchDashboardData();
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
      {latestResults.map(result => (
        <div key={result.hostname}>
          <h3>{result.hostname}</h3>
          <p>Ping: {result.ping}ms</p>
          <p>Status: {result.status}</p>
        </div>
      ))}
      
      <h3>Statistics</h3>
      <p>Average Ping: {stats.avgPing.toFixed(2)}ms</p>
      <p>Test Count: {stats.testCount}</p>
    </div>
  );
}
```

## Testing

All existing tests pass! ✅

```bash
npm test
# Test Suites: 3 passed, 3 total
# Tests: 40 passed, 40 total
```

## Next Steps

1. **Initialize Schedules** - Call `scheduleTest()` for hosts you want to monitor
2. **Setup Cron** - Choose periodic testing method (see DATABASE.md)
3. **Update Dashboard** - Modify dashboard component to use real data
4. **Monitor Data** - Check `.data/network_tests.json` for stored results
5. **Configure Backups** - Regular backup `.data/` directory

## Troubleshooting

### No data being saved?
- Check `.data/` directory exists and is writable
- Verify test calls include all required fields
- Check browser console and server logs

### Tests not running?
- Ensure scheduler is initialized
- Verify `scheduleTest()` was called for your hosts
- Check cron job is configured and running

### Performance issues?
- Old data accumulates over time
- Use `deleteOldResults(30)` to clean up data older than 30 days
- Consider moving to PostgreSQL/MongoDB for large datasets

## Learn More

- Read [DATABASE.md](./DATABASE.md) for complete documentation
- Check existing tests in `app/*.test.tsx`
- Review API routes in `app/api/*/route.ts`

## Support

For issues or questions:
1. Check [DATABASE.md](./DATABASE.md) troubleshooting section
2. Review existing code in `src/server/db.ts`
3. Check API route implementations
4. Review test files for usage examples
