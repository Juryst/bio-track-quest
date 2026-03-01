import { AnalysisStatus, MarkerStatus } from '@/types';

interface StatusBadgeProps {
  status: AnalysisStatus | MarkerStatus;
  size?: 'sm' | 'md';
}

const config: Record<string, { bg: string; label: string; text: string; border: string }> = {
  normal: { bg: 'bg-status-normal-bg', label: 'В норме', text: 'text-status-normal-text', border: 'border-status-normal-border' },
  borderline: { bg: 'bg-status-warning-bg', label: 'Погранично', text: 'text-status-warning-text', border: 'border-status-warning-border' },
  abnormal: { bg: 'bg-status-danger-bg', label: 'Есть отклонения', text: 'text-status-danger-text', border: 'border-status-danger-border' },
  low: { bg: 'bg-status-danger-bg', label: 'Ниже нормы', text: 'text-status-danger-text', border: 'border-status-danger-border' },
  high: { bg: 'bg-status-danger-bg', label: 'Выше нормы', text: 'text-status-danger-text', border: 'border-status-danger-border' },
  unknown: { bg: 'bg-status-unknown-bg', label: 'Нет данных', text: 'text-status-unknown-text', border: 'border-status-unknown-border' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status] || config.unknown;
  const sizing = size === 'sm' ? 'text-[12px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap border ${c.bg} ${c.text} ${c.border} ${sizing}`}>
      {c.label}
    </span>
  );
}
