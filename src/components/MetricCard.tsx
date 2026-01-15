'use client';

import type { ReactNode } from 'react';
import type { MetricCard as MetricCardType } from '@/src/types/network';
import { getStatusColor } from '@/src/utils/statusColors';

export function MetricCard({
  metric,
}: {
  metric: MetricCardType;
}): ReactNode {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {metric.label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
            {metric.unit ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metric.unit}
              </p>
            ) : null}
          </div>
        </div>
        <div
          className={`flex-shrink-0 p-3 rounded-lg ${getStatusColor(
            metric.status,
          )}`}
        >
          {metric.icon}
        </div>
      </div>
    </div>
  );
}
