import { Marker } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ChevronRight, GripVertical, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarkerRowProps {
  marker: Marker;
  onTap?: () => void;
  editMode?: boolean;
  onDelete?: () => void;
}

export function MarkerRow({ marker, onTap, editMode, onDelete }: MarkerRowProps) {
  const bgClass =
    marker.status === 'low' || marker.status === 'high'
      ? 'bg-[rgba(220,38,38,0.06)] dark:bg-[rgba(220,38,38,0.12)]'
      : marker.status === 'borderline'
        ? 'bg-[rgba(217,119,6,0.06)] dark:bg-[rgba(217,119,6,0.12)]'
        : '';

  return (
    <motion.button
      whileTap={{ scale: editMode ? 1 : 0.99 }}
      transition={{ duration: 0.08 }}
      onClick={editMode ? undefined : onTap}
      className={`w-full text-left flex items-center gap-2 px-4 py-3 min-h-[52px] border-b border-border/30 last:border-b-0 transition-colors active:bg-accent/50 ${bgClass}`}
    >
      {editMode && (
        <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{marker.name}</p>
        {marker.referenceRange ? (
          <p className="text-xs text-muted-foreground mt-0.5">
            Норма: {marker.referenceRange.low}–{marker.referenceRange.high}
          </p>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onTap?.(); }}
            className="text-[11px] text-muted-foreground mt-0.5 hover:text-primary"
          >
            Добавить норму ✎
          </button>
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
      {editMode ? (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="w-7 h-7 rounded-full bg-status-danger-bg flex items-center justify-center shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 text-status-danger" />
        </motion.button>
      ) : (
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
      )}
    </motion.button>
  );
}
