import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { getMarkerStatus } from '@/utils/getMarkerStatus';
import { getAnalysisStatus } from '@/utils/getAnalysisStatus';
import { Analysis, Marker } from '@/types';
import { toast } from 'sonner';

const analysisTypes = ['ОАК', 'Биохимия', 'Гормоны щитовидки', 'Другое'];

interface MarkerRow {
  key: string;
  name: string;
  value: string;
  unit: string;
  refMin: string;
  refMax: string;
}

const emptyRow = (): MarkerRow => ({
  key: Math.random().toString(36).slice(2),
  name: '', value: '', unit: '', refMin: '', refMax: '',
});

export default function UploadManual() {
  const navigate = useNavigate();
  const addAnalysis = useAnalysisStore((s) => s.addAnalysis);
  const [type, setType] = useState('ОАК');
  const [lab, setLab] = useState('');
  const [date, setDate] = useState('');
  const [rows, setRows] = useState<MarkerRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<string[]>([]);

  const updateRow = (key: string, field: keyof MarkerRow, val: string) => {
    setRows((prev) => prev.map((r) => r.key === key ? { ...r, [field]: val } : r));
  };

  const handleSave = () => {
    const errs: string[] = [];
    if (!date) errs.push('Укажите дату анализа');
    const validRows = rows.filter((r) => r.name && r.value);
    if (validRows.length === 0) errs.push('Добавьте хотя бы один показатель');
    validRows.forEach((r) => {
      if (isNaN(Number(r.value))) errs.push(`Значение "${r.name}" должно быть числом`);
    });
    if (errs.length > 0) { setErrors(errs); return; }

    const markers: Marker[] = validRows.map((r) => {
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
      type,
      lab: lab || 'Не указана',
      date: new Date(date).toISOString(),
      markers,
      status: getAnalysisStatus(markers),
    };

    addAnalysis(analysis);
    toast.success('Анализ добавлен');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-border bg-card sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Ввод вручную</h1>
      </div>

      <div className="p-5 space-y-5">
        {errors.length > 0 && (
          <div className="p-3 rounded-xl bg-status-danger-bg border border-status-danger/20">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-status-danger">{e}</p>
            ))}
          </div>
        )}

        {/* Type */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип анализа</label>
          <div className="flex flex-wrap gap-2">
            {analysisTypes.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  type === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Lab */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Лаборатория</label>
          <input
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            placeholder="Инвитро, Гемотест..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата анализа *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Markers */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Показатели</label>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.key} className="p-3 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    value={row.name}
                    onChange={(e) => updateRow(row.key, 'name', e.target.value)}
                    placeholder="Название"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button
                    onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                    className="p-2 text-muted-foreground hover:text-status-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    value={row.value}
                    onChange={(e) => updateRow(row.key, 'value', e.target.value)}
                    placeholder="Значение"
                    className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <input
                    value={row.unit}
                    onChange={(e) => updateRow(row.key, 'unit', e.target.value)}
                    placeholder="Ед."
                    className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <input
                    value={row.refMin}
                    onChange={(e) => updateRow(row.key, 'refMin', e.target.value)}
                    placeholder="Мин"
                    className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <input
                    value={row.refMax}
                    onChange={(e) => updateRow(row.key, 'refMax', e.target.value)}
                    placeholder="Макс"
                    className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setRows((prev) => [...prev, emptyRow()])}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <Plus className="w-4 h-4" /> Добавить показатель
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-card border-t border-border safe-bottom">
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
