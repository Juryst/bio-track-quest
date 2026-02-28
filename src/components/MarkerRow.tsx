import { Marker } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarkerRowProps {
  marker: Marker;
  onTap?: () => void;
}

export function MarkerRow({ marker, onTap }: MarkerRowProps) {
  const bgClass =
    marker.status === 'low' || marker.status === 'high'
      ? 'bg-[rgba(220,38,38,0.07)]'
      : marker.status === 'borderline'
        ? 'bg-[rgba(217,119,6,0.07)]'
        : '';

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.08 }}
      onClick={onTap}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 min-h-[52px] border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] last:border-b-0 transition-colors active:bg-accent ${bgClass}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{marker.name}</p>
        {marker.referenceRange && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Норма: {marker.referenceRange.low}–{marker.referenceRange.high}
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
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
    </motion.button>
  );
}
