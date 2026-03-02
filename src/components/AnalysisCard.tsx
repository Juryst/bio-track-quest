import { Analysis } from '@/types';
import { StatusBadge } from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { FileText, FlaskConical, Heart, Droplets, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const typeConfig: Record<string, { bg: string; iconColor: string; icon: React.ReactNode }> = {
  'ОАК': {
    bg: 'bg-status-danger-bg',
    iconColor: 'text-status-danger-text',
    icon: <Droplets className="w-5 h-5" />,
  },
  'Биохимия': {
    bg: 'bg-[rgba(37,99,235,0.08)]',
    iconColor: 'text-primary',
    icon: <FlaskConical className="w-5 h-5" />,
  },
  'Гормоны щитовидки': {
    bg: 'bg-status-normal-bg',
    iconColor: 'text-status-normal-text',
    icon: <Heart className="w-5 h-5" />,
  },
};

const defaultTypeConfig = {
  bg: 'bg-[rgba(124,58,237,0.08)]',
  iconColor: 'text-[#7C3AED]',
  icon: <FileText className="w-5 h-5" />,
};

const statusBorderColor: Record<string, string> = {
  abnormal: 'border-l-card-border-danger',
  borderline: 'border-l-card-border-warning',
  normal: 'border-l-card-border-normal',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getMarkerSummary(analysis: Analysis): string {
  const abnormalCount = analysis.markers.filter(m => m.status === 'low' || m.status === 'high').length;
  const borderlineCount = analysis.markers.filter(m => m.status === 'borderline').length;

  const parts: string[] = [];
  if (abnormalCount > 0) parts.push(`${abnormalCount} отклонени${abnormalCount === 1 ? 'е' : abnormalCount < 5 ? 'я' : 'й'}`);
  if (borderlineCount > 0) parts.push(`${borderlineCount} пограничн${borderlineCount === 1 ? 'ый' : 'ых'}`);
  
  return parts.length > 0 ? parts.join(' · ') : 'Все показатели в норме';
}

const statusSurfaceTint: Record<string, string> = {
  abnormal: 'bg-status-danger-bg',
  borderline: 'bg-status-warning-bg',
  normal: 'bg-status-normal-bg',
};

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const navigate = useNavigate();
  const tc = typeConfig[analysis.type] || defaultTypeConfig;
  const borderClass = statusBorderColor[analysis.status] || 'border-l-muted';
  const surfaceTint = statusSurfaceTint[analysis.status] || '';

  const labText = analysis.lab && analysis.lab !== 'Не указана' ? ` · ${analysis.lab}` : '';

  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.1, ease: 'easeInOut' }}
      onClick={() => navigate(`/analysis/${analysis.id}`)}
      className={`w-full text-left rounded-xl border border-border/60 ${surfaceTint || 'bg-card'} shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none dark:border-border p-3.5 pl-0 border-l-[3px] ${borderClass} transition-shadow`}
    >
      <div className="flex items-center gap-3 pl-3">
        <div className={`w-10 h-10 rounded-[10px] ${tc.bg} flex items-center justify-center shrink-0 ${tc.iconColor}`}>
          {tc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-base text-foreground truncate">{analysis.type}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <StatusBadge status={analysis.status} />
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatDate(analysis.date)}{labText}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            {getMarkerSummary(analysis)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
