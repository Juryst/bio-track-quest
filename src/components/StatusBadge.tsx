import { AnalysisStatus, MarkerStatus } from '@/types';

interface StatusBadgeProps {
  status: AnalysisStatus | MarkerStatus;
  size?: 'sm' | 'md';
}

const config: Record<string, { dot: string; label: string; text: string }> = {
  normal: { dot: 'bg-status-normal', label: 'В норме', text: 'text-status-normal' },
  borderline: { dot: 'bg-status-warning', label: 'Погранично', text: 'text-status-warning' },
  abnormal: { dot: 'bg-status-danger', label: 'Есть отклонения', text: 'text-status-danger' },
  low: { dot: 'bg-status-danger', label: 'Ниже нормы', text: 'text-status-danger' },
  high: { dot: 'bg-status-danger', label: 'Выше нормы', text: 'text-status-danger' },
  unknown: { dot: 'bg-status-unknown', label: 'Нет данных', text: 'text-status-unknown' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status] || config.unknown;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${c.text} ${textSize}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}
