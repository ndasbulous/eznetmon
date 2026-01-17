import type { ReactNode } from 'react';

interface MetricRowProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
}

export function MetricRow({
  label,
  value,
  unit,
  icon,
}: MetricRowProps): ReactNode {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="text-gray-400 dark:text-gray-600">{icon}</span>
        ) : null}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        {value}
        {unit ? ` ${unit}` : ''}
      </span>
    </div>
  );
}
