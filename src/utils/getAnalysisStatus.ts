import { AnalysisStatus, Marker } from '@/types';

export function getAnalysisStatus(markers: Marker[]): AnalysisStatus {
  if (markers.some(m => m.status === 'low' || m.status === 'high')) return 'abnormal';
  if (markers.some(m => m.status === 'borderline')) return 'borderline';
  return 'normal';
}
