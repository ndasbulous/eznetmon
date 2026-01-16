import { NextRequest, NextResponse } from 'next/server';
import { saveNetworkTest, getNetworkTestResults, getTestStatistics } from '@/src/server/db';
import type { NetworkTestResult } from '@/src/types/network';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { hostname, timestamp, ping, latency, jitter, packetLoss, minLatency, maxLatency, status } = body;

    // Validate required fields
    if (!hostname || !timestamp || typeof ping !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: hostname, timestamp, ping' },
        { status: 400 }
      );
    }

    // Save the test result
    saveNetworkTest({
      hostname,
      timestamp,
      ping,
      latency: latency || ping,
      jitter: jitter || 0,
      packetLoss: packetLoss || 0,
      minLatency: minLatency || ping,
      maxLatency: maxLatency || ping,
      status: status || 'success',
    });

    return NextResponse.json(
      { success: true, message: 'Test result saved' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving test result:', error);
    return NextResponse.json(
      { error: 'Failed to save test result' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hostname = searchParams.get('hostname') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
      const statistics = getTestStatistics(hostname);
      return NextResponse.json(statistics);
    }

    const results = getNetworkTestResults(hostname, limit, offset);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 }
    );
  }
}
