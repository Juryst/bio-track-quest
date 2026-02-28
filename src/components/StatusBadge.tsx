import { AnalysisStatus, MarkerStatus } from '@/types';

interface StatusBadgeProps {
  status: AnalysisStatus | MarkerStatus;
  size?: 'sm' | 'md';
}

const config: Record<string, { bg: string; label: string; text: string }> = {
  normal: { bg: 'bg-status-normal-bg', label: 'В норме', text: 'text-status-normal-text' },
  borderline: { bg: 'bg-status-warning-bg', label: 'Погранично', text: 'text-status-warning-text' },
  abnormal: { bg: 'bg-status-danger-bg', label: 'Есть отклонения', text: 'text-status-danger-text' },
  low: { bg: 'bg-status-danger-bg', label: 'Ниже нормы', text: 'text-status-danger-text' },
  high: { bg: 'bg-status-danger-bg', label: 'Выше нормы', text: 'text-status-danger-text' },
  unknown: { bg: 'bg-status-unknown-bg', label: 'Нет данных', text: 'text-status-unknown-text' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status] || config.unknown;
  const sizing = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${c.bg} ${c.text} ${sizing}`}>
      {c.label}
    </span>
  );
}
