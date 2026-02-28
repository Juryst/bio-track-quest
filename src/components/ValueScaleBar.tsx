import { ReferenceRange, MarkerStatus } from '@/types';

interface ValueScaleBarProps {
  value: number;
  referenceRange: ReferenceRange;
  status: MarkerStatus;
}

export function ValueScaleBar({ value, referenceRange, status }: ValueScaleBarProps) {
  const { low, high } = referenceRange;
  const range = high - low;
  const padding = Math.max(range * 0.35, 1);
  const scaleMin = low - padding;
  const scaleMax = high + padding;
  const totalRange = scaleMax - scaleMin;

  const normLeft = ((low - scaleMin) / totalRange) * 100;
  const normWidth = ((high - low) / totalRange) * 100;
  const dotPos = Math.max(2, Math.min(98, ((value - scaleMin) / totalRange) * 100));

  const dotColor =
    status === 'normal'
      ? 'bg-status-normal'
      : status === 'borderline'
        ? 'bg-status-warning'
        : 'bg-status-danger';

  return (
    <div className="w-full py-1">
      <div className="relative h-1.5 bg-muted rounded-full">
        {/* Normal zone */}
        <div
          className="absolute top-0 h-full bg-status-normal/25 rounded-full"
          style={{ left: `${normLeft}%`, width: `${normWidth}%` }}
        />
        {/* Value dot */}
        <div
          className={`absolute top-1/2 w-3.5 h-3.5 rounded-full ${dotColor} border-2 border-card shadow-sm`}
          style={{ left: `${dotPos}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        />
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-[10px] text-muted-foreground">{low}</span>
        <span className="text-[10px] font-medium text-muted-foreground">Норма</span>
        <span className="text-[10px] text-muted-foreground">{high}</span>
      </div>
    </div>
  );
}
