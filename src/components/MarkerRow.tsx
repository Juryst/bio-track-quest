import { Marker } from '@/types';
import { StatusBadge } from './StatusBadge';

interface MarkerRowProps {
  marker: Marker;
  onTap?: () => void;
}

export function MarkerRow({ marker, onTap }: MarkerRowProps) {
  const bgClass = marker.status === 'low' || marker.status === 'high'
    ? 'bg-status-danger-bg'
    : marker.status === 'borderline'
      ? 'bg-status-warning-bg'
      : '';

  return (
    <button
      onClick={onTap}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 transition-colors active:bg-accent ${bgClass}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{marker.name}</p>
        {marker.referenceRange && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {marker.referenceRange.low}–{marker.referenceRange.high} {marker.referenceRange.unit}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-mono font-semibold text-foreground">
          {marker.value} <span className="text-xs font-normal text-muted-foreground">{marker.unit}</span>
        </p>
      </div>
      <div className="shrink-0">
        <StatusBadge status={marker.status} />
      </div>
    </button>
  );
}
