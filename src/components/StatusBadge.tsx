import { AnalysisStatus, MarkerStatus } from '@/types';

interface StatusBadgeProps {
  status: AnalysisStatus | MarkerStatus;
  size?: 'sm' | 'md';
}

const config: Record<string, { dot: string; label: string; bg: string; text: string }> = {
  normal: { dot: 'bg-status-normal', label: 'В норме', bg: 'bg-status-normal-bg', text: 'text-status-normal' },
  borderline: { dot: 'bg-status-warning', label: 'Погранично', bg: 'bg-status-warning-bg', text: 'text-status-warning' },
  abnormal: { dot: 'bg-status-danger', label: 'Есть отклонения', bg: 'bg-status-danger-bg', text: 'text-status-danger' },
  low: { dot: 'bg-status-danger', label: 'Ниже нормы', bg: 'bg-status-danger-bg', text: 'text-status-danger' },
  high: { dot: 'bg-status-danger', label: 'Выше нормы', bg: 'bg-status-danger-bg', text: 'text-status-danger' },
  unknown: { dot: 'bg-status-unknown', label: 'Нет данных', bg: 'bg-status-unknown-bg', text: 'text-status-unknown' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status] || config.unknown;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
