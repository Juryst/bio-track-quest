import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, User, ClipboardList, Calendar, AlertTriangle } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { AnalysisCard } from '@/components/AnalysisCard';
import { SkeletonCard } from '@/components/SkeletonCard';

const filterKeys = ['Все', 'Отклонения', 'ОАК', 'Биохимия', 'Гормоны'] as const;

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const analyses = useAnalysisStore((s) => s.analyses);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('Все');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['Все'] = analyses.length;
    counts['Отклонения'] = analyses.filter(a => a.status === 'abnormal' || a.status === 'borderline').length;
    counts['ОАК'] = analyses.filter(a => a.type === 'ОАК').length;
    counts['Биохимия'] = analyses.filter(a => a.type === 'Биохимия').length;
    counts['Гормоны'] = analyses.filter(a => a.type.includes('Гормон')).length;
    return counts;
  }, [analyses]);

  const filtered = useMemo(() => {
    return analyses.filter((a) => {
      if (activeFilter === 'Все') return true;
      if (activeFilter === 'Отклонения') return a.status === 'abnormal' || a.status === 'borderline';
      if (activeFilter === 'Гормоны') return a.type.includes('Гормон');
      return a.type === activeFilter;
    });
  }, [analyses, activeFilter]);

  const abnormalCount = useMemo(() => analyses.filter(a => a.status === 'abnormal' || a.status === 'borderline').length, [analyses]);
  const lastDate = useMemo(() => {
    if (analyses.length === 0) return '—';
    const sorted = [...analyses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return formatShortDate(sorted[0].date);
  }, [analyses]);

  return (
    <div className="min-h-screen bg-background pb-40">
      <div className="max-w-[480px] mx-auto">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Мои анализы</h1>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <User className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Filters with counts */}
        <div className="px-4 pb-3 relative">
          <div className="overflow-x-auto scrollbar-none" style={{ maskImage: 'linear-gradient(to right, black 90%, transparent 100%)' }}>
            <div className="flex gap-2 pr-8">
              {filterKeys.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap px-3 h-8 rounded-full text-xs font-medium transition-all duration-200 shrink-0 ${
                    activeFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent border border-muted-foreground/40 text-muted-foreground'
                  }`}
                >
                  {f} ({filterCounts[f]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        {!loading && analyses.length > 0 && (
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between rounded-[10px] bg-secondary px-4 py-2.5 text-sm">
              <div className="flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Всего:</span>
                <span className="font-medium text-foreground">{analyses.length}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-status-danger" />
                <span className="text-muted-foreground">Отклон.:</span>
                <span className="font-medium text-foreground">{abnormalCount}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{lastDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 space-y-2">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filtered.length === 0 && analyses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <ClipboardList className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-foreground font-semibold mb-1">Нет анализов в этой категории</p>
              <p className="text-sm text-muted-foreground">Попробуйте выбрать другой фильтр</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-foreground font-semibold mb-1">Загрузите первый анализ</p>
              <p className="text-sm text-muted-foreground mb-4">Начните отслеживать своё здоровье</p>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                Добавить
              </button>
            </motion.div>
          ) : (
            filtered.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AnalysisCard analysis={a} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* FAB */}
      {!loading && analyses.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ delay: 0.3, type: 'spring' }}
          onClick={() => navigate('/upload')}
          className="fixed right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center z-40"
          style={{ bottom: 'calc(56px + 16px + env(safe-area-inset-bottom, 0px))' }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
