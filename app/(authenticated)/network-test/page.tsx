import type { ReactNode } from 'react';
import { NetworkTestDisplay } from '@/src/components/NetworkTestDisplay';

/**
 * Example page demonstrating the NetworkTestDisplay server component
 * This component performs actual network tests server-side and displays results
 */
export default function NetworkTestExamplePage(): ReactNode {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Network Connectivity Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time network performance monitoring to external hosts
        </p>
      </section>

      {/* Single Host Test */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          detik.com Connectivity
        </h2>
        <NetworkTestDisplay hostname="detik.com" numberOfPings={10} />
      </section>

      {/* Multiple Host Tests */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Multiple Host Connectivity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              cloudflare.com
            </h3>
            <NetworkTestDisplay
              hostname="cloudflare.com"
              numberOfPings={10}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              pajak.go.id
            </h3>
            <NetworkTestDisplay hostname="pajak.go.id" numberOfPings={10} />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          About Network Tests
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>
            <strong>Ping:</strong> Average response time to the host
          </li>
          <li>
            <strong>Latency:</strong> Minimum and maximum response times
          </li>
          <li>
            <strong>Jitter:</strong> Variability in response times (lower is better)
          </li>
          <li>
            <strong>Packet Loss:</strong> Percentage of failed connections
          </li>
        </ul>
      </section>
    </div>
  );
}
