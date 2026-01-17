'use client';

import type { ReactNode } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export function StatusIcon(
  status: 'success' | 'warning' | 'error'
): ReactNode {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
  }
}
