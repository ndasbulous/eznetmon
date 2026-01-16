import { NextRequest, NextResponse } from 'next/server';
import { runScheduledTests, runTestsForHosts } from '@/src/actions/testScheduler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, hosts } = body;

    if (action === 'run-scheduled') {
      const result = await runScheduledTests();
      return NextResponse.json(result, { status: 200 });
    }

    if (action === 'run-tests' && Array.isArray(hosts) && hosts.length > 0) {
      const result = await runTestsForHosts(hosts);
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing hosts' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error running tests:', error);
    return NextResponse.json(
      { error: 'Failed to run tests' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'run-scheduled') {
      const result = await runScheduledTests();
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error running tests:', error);
    return NextResponse.json(
      { error: 'Failed to run tests' },
      { status: 500 }
    );
  }
}
