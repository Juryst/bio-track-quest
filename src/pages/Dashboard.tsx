import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ClipboardList, Calendar, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useProfilesStore } from '@/store/useProfilesStore';
import { AnalysisCard } from '@/components/AnalysisCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';

const filterKeys = ['Все', 'Отклонения', 'ОАК', 'Биохимия', 'Гормоны'] as const;

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeProfileId, profiles } = useProfilesStore();
  const getAnalysesForProfile = useAnalysisStore((s) => s.getAnalysesForProfile);
  const analyses = useMemo(() => getAnalysesForProfile(activeProfileId), [getAnalysesForProfile, activeProfileId]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('Все');
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['Все'] = analyses.length;
    counts['Отклонения'] = analyses.filter((a) => a.status === 'abnormal' || a.status === 'borderline').length;
    counts['ОАК'] = analyses.filter((a) => a.type === 'ОАК').length;
    counts['Биохимия'] = analyses.filter((a) => a.type === 'Биохимия').length;
    counts['Гормоны'] = analyses.filter((a) => a.type.includes('Гормон')).length;
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

  const abnormalCount = useMemo(
    () => analyses.filter((a) => a.status === 'abnormal' || a.status === 'borderline').length,
    [analyses]
  );
  const lastDate = useMemo(() => {
    if (analyses.length === 0) return '—';
    const sorted = [...analyses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return formatShortDate(sorted[0].date);
  }, [analyses]);

  const headerTitle = activeProfile?.relation === 'self' ? 'Мои анализы' : `${activeProfile?.name}: анализы`;

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">{headerTitle}</h1>
        </div>
        <button
          onClick={() => setProfileSwitcherOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground"
        >
          <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
            {activeProfile?.name[0] || '?'}
          </span>
          {activeProfile?.name || 'Профиль'}
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Filters with counts */}
      <div className="px-4 pb-3 relative">
        <div
          className="overflow-x-auto scrollbar-none"
          style={{ maskImage: 'linear-gradient(to right, black 88%, transparent 100%)' }}
        >
          <div className="flex gap-2 pr-8">
            {filterKeys.map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.08 }}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-3 h-8 rounded-full text-xs font-medium transition-all duration-200 shrink-0 border ${
                  activeFilter === f
                    ? 'bg-primary text-primary-foreground border-transparent'
                    : 'bg-transparent border-border text-muted-foreground'
                }`}
              >
                {f} ({filterCounts[f]})
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {!loading && analyses.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between rounded-[10px] bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.04)] px-3.5 py-2 text-[13px]">
            <div className="flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {activeFilter === 'Все' ? 'Всего:' : 'Показано:'}
              </span>
              <span className="font-semibold text-foreground">
                {activeFilter === 'Все' ? analyses.length : filtered.length}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">⚠️</span>
              <span className="text-muted-foreground">Отклон.:</span>
              <span className="font-semibold text-foreground">{abnormalCount}</span>
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
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/upload')}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Добавить
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <AnalysisCard analysis={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* FAB */}
      {!loading && analyses.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ delay: 0.3, type: 'spring' }}
          onClick={() => navigate('/upload')}
          className="fixed w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center z-40"
          style={{
            bottom: 'calc(56px + 16px + env(safe-area-inset-bottom, 0px))',
            right: 'max(16px, calc(50vw - 224px))',
          }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      <ProfileSwitcher open={profileSwitcherOpen} onClose={() => setProfileSwitcherOpen(false)} />
    </div>
  );
}
