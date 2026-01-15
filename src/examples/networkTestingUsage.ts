/**
 * Network Testing Example Usage
 *
 * This file demonstrates how to use the server-side network testing functionality
 * in your Next.js application.
 */

// Example 1: Using the Server Action in a Client Component
// ======================================================

/*
'use client';

import { useState } from 'react';
import { testNetworkLatency } from '@/src/actions/networkTest';
import type { NetworkTestResult } from '@/src/types/network';

export function NetworkTestComponent() {
  const [hostname, setHostname] = useState('google.com');
  const [result, setResult] = useState<NetworkTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const testResult = await testNetworkLatency(hostname, 5);
      setResult(testResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          placeholder="Enter hostname (e.g., google.com)"
          className="px-3 py-2 border rounded"
        />
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Network'}
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {result && (
        <div className="space-y-2 p-4 bg-gray-100 rounded">
          <p><strong>Hostname:</strong> {result.hostname}</p>
          <p><strong>Ping:</strong> {result.ping} ms</p>
          <p><strong>Latency:</strong> {result.latency} ms (min) - {result.maxLatency} ms (max)</p>
          <p><strong>Jitter:</strong> {result.jitter} ms</p>
          <p><strong>Packet Loss:</strong> {result.packetLoss} %</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Timestamp:</strong> {result.timestamp}</p>
        </div>
      )}
    </div>
  );
}
*/

// Example 2: Using the Server Functions Directly in a Server Component
// ====================================================================

/*
import { performNetworkTest } from '@/src/server/network';

export async function NetworkMetricsDisplay() {
  const result = await performNetworkTest('google.com', 5);

  return (
    <div>
      <h2>Network Test Results for {result.hostname}</h2>
      <ul>
        <li>Average Ping: {result.ping} ms</li>
        <li>Min Latency: {result.minLatency} ms</li>
        <li>Max Latency: {result.maxLatency} ms</li>
        <li>Jitter: {result.jitter} ms</li>
        <li>Packet Loss: {result.packetLoss}%</li>
        <li>Status: {result.status}</li>
      </ul>
    </div>
  );
}
*/

// Example 3: API Route Handler
// ============================

/*
// app/api/network-test/route.ts
import { testNetworkLatency } from '@/src/actions/networkTest';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostname, numberOfPings = 5 } = body;

    if (!hostname) {
      return NextResponse.json(
        { error: 'hostname is required' },
        { status: 400 }
      );
    }

    const result = await testNetworkLatency(hostname, numberOfPings);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
*/

export {};
