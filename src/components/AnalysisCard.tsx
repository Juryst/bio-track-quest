import { Analysis } from '@/types';
import { StatusBadge } from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { FileText, FlaskConical, Heart, Droplets } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  'ОАК': <Droplets className="w-5 h-5 text-status-danger" />,
  'Биохимия': <FlaskConical className="w-5 h-5 text-status-warning" />,
  'Гормоны щитовидки': <Heart className="w-5 h-5 text-primary" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/analysis/${analysis.id}`)}
      className="w-full text-left rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
          {typeIcons[analysis.type] || <FileText className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm text-foreground truncate">{analysis.type}</span>
            <StatusBadge status={analysis.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(analysis.date)} · {analysis.lab}
          </p>
        </div>
      </div>
    </button>
  );
}
