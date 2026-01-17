import React from 'react';
import type { StatusType } from './StatusType';

export interface MetricCard {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  status: StatusType;
}
