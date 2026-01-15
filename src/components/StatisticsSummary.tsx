'use client';

import type { ReactNode } from 'react';
import type { StatisticsSummary } from '@/src/types/network';

export function StatisticsSummary({
  statistics,
}: {
  statistics: Array<StatisticsSummary>;
}): ReactNode {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statistics.map((stat: StatisticsSummary) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {stat.label}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
              {stat.unit ? ` ${stat.unit}` : ''}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% {stat.trendLabel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
