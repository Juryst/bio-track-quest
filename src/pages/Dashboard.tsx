import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, User } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { AnalysisCard } from '@/components/AnalysisCard';
import { SkeletonCard } from '@/components/SkeletonCard';

const filters = ['Все', 'Отклонения', 'ОАК', 'Биохимия', 'Гормоны'];

export default function Dashboard() {
  const navigate = useNavigate();
  const analyses = useAnalysisStore((s) => s.analyses);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Все');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = analyses.filter((a) => {
    if (activeFilter === 'Все') return true;
    if (activeFilter === 'Отклонения') return a.status === 'abnormal';
    if (activeFilter === 'Гормоны') return a.type.includes('Гормон');
    return a.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Мои анализы</h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
        >
          <User className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 pb-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
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

      {/* FAB */}
      {!loading && analyses.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          onClick={() => navigate('/upload')}
          className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
