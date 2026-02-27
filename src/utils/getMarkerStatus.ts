import { MarkerStatus, ReferenceRange } from '@/types';

export function getMarkerStatus(value: number, range?: ReferenceRange): MarkerStatus {
  if (!range) return 'unknown';
  const margin = (range.high - range.low) * 0.05;
  if (value < range.low) return 'low';
  if (value > range.high) return 'high';
  if (value < range.low + margin || value > range.high - margin) return 'borderline';
  return 'normal';
}
