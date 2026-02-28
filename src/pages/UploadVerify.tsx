import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { getMarkerStatus } from '@/utils/getMarkerStatus';
import { getAnalysisStatus } from '@/utils/getAnalysisStatus';
import { Analysis, Marker } from '@/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface OcrRow {
  key: string;
  name: string;
  value: string;
  unit: string;
  refMin: string;
  refMax: string;
}

const mockOcrResult: OcrRow[] = [
  { key: '1', name: 'Гемоглобин', value: '125', unit: 'г/л', refMin: '120', refMax: '160' },
  { key: '2', name: 'Эритроциты', value: '4.5', unit: '×10¹²/л', refMin: '3.9', refMax: '5.0' },
  { key: '3', name: 'Лейкоциты', value: '7.1', unit: '×10⁹/л', refMin: '4', refMax: '9' },
  { key: '4', name: 'Тромбоциты', value: '280', unit: '×10⁹/л', refMin: '150', refMax: '400' },
];

export default function UploadVerify() {
  const navigate = useNavigate();
  const addAnalysis = useAnalysisStore((s) => s.addAnalysis);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<OcrRow[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setRows(mockOcrResult);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const updateRow = (key: string, field: keyof OcrRow, val: string) => {
    setRows((prev) => prev.map((r) => r.key === key ? { ...r, [field]: val } : r));
  };

  const handleSave = () => {
    const markers: Marker[] = rows.filter((r) => r.name && r.value).map((r) => {
      const val = Number(r.value);
      const range = r.refMin && r.refMax ? { low: Number(r.refMin), high: Number(r.refMax), unit: r.unit } : undefined;
      return {
        id: Math.random().toString(36).slice(2),
        name: r.name,
        canonicalName: r.name.toLowerCase().replace(/\s+/g, '_'),
        value: val,
        unit: r.unit,
        referenceRange: range,
        status: getMarkerStatus(val, range),
      };
    });

    const analysis: Analysis = {
      id: Math.random().toString(36).slice(2),
      type: 'ОАК',
      lab: 'Распознано',
      date: new Date().toISOString(),
      markers,
      status: getAnalysisStatus(markers),
    };

    addAnalysis(analysis);
    toast.success('Анализ сохранён');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-sm text-foreground font-medium">Распознаём данные...</p>
        <p className="text-xs text-muted-foreground">Это займёт пару секунд</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-border bg-card sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Проверьте данные</h1>
      </div>

      <div className="p-5">
        <p className="text-xs text-muted-foreground mb-4">
          Мы распознали следующие данные — проверьте перед сохранением
        </p>

        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.key} className="p-3 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2">
                <input
                  value={row.name}
                  onChange={(e) => updateRow(row.key, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none"
                />
                <button
                  onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                  className="p-2 text-muted-foreground hover:text-status-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <input value={row.value} onChange={(e) => updateRow(row.key, 'value', e.target.value)} placeholder="Знач."
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none" />
                <input value={row.unit} onChange={(e) => updateRow(row.key, 'unit', e.target.value)} placeholder="Ед."
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none" />
                <input value={row.refMin} onChange={(e) => updateRow(row.key, 'refMin', e.target.value)} placeholder="Мин"
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none" />
                <input value={row.refMax} onChange={(e) => updateRow(row.key, 'refMax', e.target.value)} placeholder="Макс"
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setRows((prev) => [...prev, { key: Math.random().toString(36).slice(2), name: '', value: '', unit: '', refMin: '', refMax: '' }])}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Plus className="w-4 h-4" /> Добавить показатель
        </button>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-card border-t border-border safe-bottom">
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          Сохранить анализ
        </button>
      </div>
    </div>
  );
}
