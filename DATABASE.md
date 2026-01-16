# Database & Scheduled Testing Integration

This guide explains how to use the SQLite-backed database system for storing and querying network test results.

## Architecture Overview

The system uses a file-based JSON storage (stored in `.data/` directory) to persist network test results without requiring external dependencies. This approach:

- ✅ Works in all environments (development, production, serverless)
- ✅ No native dependencies (Python, C++, etc.)
- ✅ Simple file-based persistence
- ✅ Easy to backup and migrate

## Core Components

### 1. Database Layer (`src/server/db.ts`)

Provides functions for storing and retrieving network test results:

```typescript
// Save a test result
saveNetworkTest({
  hostname: 'google.com',
  timestamp: '2024-01-16T14:30:00Z',
  ping: 24,
  latency: 18,
  jitter: 2.5,
  packetLoss: 0,
  minLatency: 15,
  maxLatency: 30,
  status: 'success',
});

// Get latest results for all hosts
const results = getLatestTestResults();

// Get results for specific host
const googleResults = getLatestTestResults('google.com');

// Get statistics
const stats = getTestStatistics('google.com');
// Returns: { avgPing, minPing, maxPing, avgLatency, avgJitter, avgPacketLoss, testCount }

// Schedule a test
scheduleTest('google.com', 5); // Run every 5 minutes

// Get scheduled tests
const scheduled = getScheduledTests();
```

### 2. Test Scheduler (`src/actions/testScheduler.ts`)

Handles periodic test execution:

```typescript
// Run all scheduled tests
const result = await runScheduledTests();
// Returns: { executed: number, failed: number, results: NetworkTestResult[] }

// Run tests for specific hosts
const result = await runTestsForHosts(['google.com', 'cloudflare.com']);
```

### 3. API Routes

#### POST/GET `/api/test-results`
Save and retrieve test results:

```bash
# Save a test result
curl -X POST http://localhost:3000/api/test-results \
  -H "Content-Type: application/json" \
  -d '{
    "hostname": "google.com",
    "timestamp": "2024-01-16T14:30:00Z",
    "ping": 24,
    "latency": 18,
    "jitter": 2.5,
    "packetLoss": 0,
    "status": "success"
  }'

# Get test results
curl "http://localhost:3000/api/test-results?hostname=google.com&limit=50"

# Get statistics
curl "http://localhost:3000/api/test-results?stats=true&hostname=google.com"
```

#### POST `/api/run-tests`
Trigger test execution:

```bash
# Run scheduled tests
curl -X POST http://localhost:3000/api/run-tests \
  -H "Content-Type: application/json" \
  -d '{"action": "run-scheduled"}'

# Run tests for specific hosts
curl -X POST http://localhost:3000/api/run-tests \
  -H "Content-Type: application/json" \
  -d '{
    "action": "run-tests",
    "hosts": ["google.com", "cloudflare.com"]
  }'
```

## Setting Up Periodic Testing

### Option 1: API-Based Scheduling (Recommended for Cloud)

Use an external cron service (e.g., EasyCron, Vercel Crons) to periodically call the API:

```bash
# Call every 5 minutes
curl https://yourapp.vercel.app/api/run-tests?action=run-scheduled
```

### Option 2: Node.js Scheduler (For Self-Hosted)

Install and use `node-cron`:

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
    try {
      const result = await runScheduledTests();
      console.log(`Tests executed: ${result.executed}, Failed: ${result.failed}`);
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  });

  console.log('Scheduler initialized');
}
```

Then initialize in `app/layout.tsx`:

```typescript
import { initializeScheduler } from '@/src/lib/scheduler';

export default function RootLayout({ children }: Props) {
  // Only on server
  if (typeof window === 'undefined') {
    initializeScheduler();
  }

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Option 3: Next.js App Router (Vercel Edge Functions)

Create `app/api/cron/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { runScheduledTests } from '@/src/actions/testScheduler';

export const maxDuration = 60; // 60 seconds for Hobby plan

export async function GET(request: NextRequest) {
  // Verify it's from Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runScheduledTests();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Test execution failed' }, { status: 500 });
  }
}
```

Then configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Set the cron secret in your Vercel environment:
```bash
vercel env add CRON_SECRET <your_secret>
```

## Data Storage

Test results are stored in `.data/network_tests.json`:

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

Scheduled tests are stored in `.data/test_schedules.json`:

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

## Integration with Dashboard

The dashboard component automatically:
1. Runs scheduled tests on page load
2. Displays latest test results
3. Shows statistics for each host

```typescript
import { fetchDashboardData } from '@/src/actions/dashboard';

async function Dashboard() {
  const { latestResults, stats } = await fetchDashboardData();
  
  return (
    <div>
      {/* Display results */}
      {latestResults.map(result => (
        <div key={result.hostname}>
          <h3>{result.hostname}</h3>
          <p>Ping: {result.ping}ms</p>
          <p>Latency: {result.latency}ms</p>
        </div>
      ))}
    </div>
  );
}
```

## Database Management

### Backup Data

```bash
# Copy .data directory
cp -r .data .data.backup.$(date +%Y%m%d)
```

### Cleanup Old Data

```typescript
import { deleteOldResults } from '@/src/server/db';

// Delete results older than 30 days
deleteOldResults(30);
```

### Query Data Programmatically

```typescript
import {
  getNetworkTestResults,
  getTestResultsForPeriod,
  getTestStatistics,
} from '@/src/server/db';

// Get recent results
const recentResults = getNetworkTestResults('google.com', 100, 0);

// Get results from last 7 days
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const weekResults = getTestResultsForPeriod(sevenDaysAgo, new Date());

// Get statistics
const stats = getTestStatistics('google.com');
console.log(`Average ping: ${stats.avgPing}ms`);
```

## Environment Variables

Optional configuration via `.env.local`:

```env
# Data directory (defaults to ./.data)
DATA_DIR=/path/to/data

# Default test interval (minutes)
TEST_INTERVAL=5

# Hosts to monitor (comma-separated)
MONITORED_HOSTS=google.com,cloudflare.com,amazon.com
```

## Troubleshooting

### Issue: Data directory not created

**Solution**: Ensure the application has write permissions in the project root.

```bash
# Check permissions
ls -la | grep .data

# Create manually
mkdir -p .data
chmod 755 .data
```

### Issue: Tests not running

**Solution**: Check if scheduler is initialized:

```typescript
// Add to your layout or API route
import { getScheduledTests } from '@/src/server/db';

console.log('Scheduled tests:', getScheduledTests());
```

### Issue: Old data filling up disk

**Solution**: Set up automated cleanup:

```typescript
import { deleteOldResults } from '@/src/server/db';

// Schedule cleanup weekly
cron.schedule('0 0 * * 0', () => {
  const deleted = deleteOldResults(30); // Keep 30 days
  console.log(`Cleaned up ${deleted} old test results`);
});
```

## Best Practices

1. **Schedule Tests**: Always use `scheduleTest()` to register hosts before running tests
2. **Monitor Disk Usage**: Implement cleanup policies for old results
3. **Backup Data**: Regularly backup the `.data` directory
4. **Error Handling**: Always wrap test calls in try-catch blocks
5. **Rate Limiting**: Avoid running tests more frequently than every 1-2 minutes
6. **Logging**: Enable detailed logging for troubleshooting

## Next Steps

1. Add client-side real-time updates with WebSocket or polling
2. Integrate with external databases (PostgreSQL, MongoDB) for production
3. Add data visualization dashboards
4. Implement alert notifications for failing tests
5. Add multi-host comparison analytics
