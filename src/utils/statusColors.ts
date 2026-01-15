import type { StatusType } from '@/src/types/network';

export function getStatusColor(status: string): string {
  switch (status) {
    case 'good':
    case 'success':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950';
    case 'critical':
    case 'error':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}
