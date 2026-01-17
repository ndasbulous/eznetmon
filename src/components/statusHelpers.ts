
export function getStatusColor(status: 'success' | 'warning' | 'error'): string {
  switch (status) {
    case 'success':
      return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    case 'error':
      return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
  }
}

export function getTextColor(status: 'success' | 'warning' | 'error'): string {
  switch (status) {
    case 'success':
      return 'text-green-900 dark:text-green-100';
    case 'warning':
      return 'text-yellow-900 dark:text-yellow-100';
    case 'error':
      return 'text-red-900 dark:text-red-100';
  }
}
