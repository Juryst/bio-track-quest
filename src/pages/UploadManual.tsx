import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Info } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useProfilesStore } from '@/store/useProfilesStore';
import { getMarkerStatus } from '@/utils/getMarkerStatus';
import { getAnalysisStatus } from '@/utils/getAnalysisStatus';
import { Analysis, Marker } from '@/types';
import { MarkerAutocomplete } from '@/components/MarkerAutocomplete';
import { UnitSelector } from '@/components/UnitSelector';
import { MARKER_DEFAULTS } from '@/utils/markerDefaults';
import { toast } from 'sonner';

const analysisTypes = ['ОАК', 'Биохимия', 'Гормоны щитовидки', 'Другое'];

interface MarkerRow {
  key: string;
  name: string;
  value: string;
  unit: string;
  refMin: string;
  refMax: string;
  autoFilled?: boolean;
}

const emptyRow = (): MarkerRow => ({
  key: Math.random().toString(36).slice(2),
  name: '', value: '', unit: '', refMin: '', refMax: '',
});

export default function UploadManual() {
  const navigate = useNavigate();
  const addAnalysis = useAnalysisStore((s) => s.addAnalysis);
  const activeProfileId = useProfilesStore((s) => s.activeProfileId);
  const [type, setType] = useState('ОАК');
  const [lab, setLab] = useState('');
  const [date, setDate] = useState('');
  const [rows, setRows] = useState<MarkerRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateRow = (key: string, field: keyof MarkerRow, val: string) => {
    setRows((prev) => prev.map((r) => r.key === key ? { ...r, [field]: val, autoFilled: field === 'name' ? false : r.autoFilled } : r));
  };

  const handleAutocomplete = (key: string, name: string, defaults: { unit: string; refLow: number; refHigh: number }) => {
    setRows((prev) => prev.map((r) => r.key === key ? {
      ...r,
      name,
      unit: defaults.unit,
      refMin: String(defaults.refLow),
      refMax: String(defaults.refHigh),
      autoFilled: true,
    } : r));
  };

  const validateValue = (val: string) => {
    if (!val) return undefined;
    const n = parseFloat(val.replace(',', '.'));
    if (isNaN(n)) return 'Введите число';
    if (n < 0) return 'Значение не может быть отрицательным';
    return undefined;
  };

  const handleSave = () => {
    const errs: string[] = [];
    if (!date) errs.push('Укажите дату анализа');
    const validRows = rows.filter((r) => r.name && r.value);
    if (validRows.length === 0) errs.push('Добавьте хотя бы один показатель');
    validRows.forEach((r) => {
      if (isNaN(Number(r.value.replace(',', '.')))) errs.push(`Значение "${r.name}" должно быть числом`);
      if (!r.unit) errs.push(`Выберите единицу для "${r.name}"`);
    });
    if (errs.length > 0) { setErrors(errs); return; }

    const markers: Marker[] = validRows.map((r) => {
      const val = Number(r.value.replace(',', '.'));
      const range = r.refMin && r.refMax
        ? { low: Number(r.refMin.replace(',', '.')), high: Number(r.refMax.replace(',', '.')), unit: r.unit }
        : undefined;
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
      profileId: activeProfileId,
      type,
      lab: lab || '',
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
          <div className="p-3 rounded-xl bg-status-danger-bg border border-status-danger-border">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-status-danger-text">{e}</p>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип анализа</label>
          <div className="flex flex-wrap gap-2">
            {analysisTypes.map((t) => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.97 }}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  type === t ? 'bg-primary text-primary-foreground border-transparent' : 'bg-transparent border-border text-muted-foreground'
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Лаборатория</label>
          <input
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            placeholder="Инвитро, Гемотест..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата анализа *</label>
          <input
            type="date"
            lang="ru"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Показатели</label>
          <AnimatePresence>
            <div className="space-y-3">
              {rows.map((row) => {
                const valErr = touched[`${row.key}-value`] ? validateValue(row.value) : undefined;
                return (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 rounded-xl border border-border bg-card space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <MarkerAutocomplete
                        value={row.name}
                        onChange={(name) => updateRow(row.key, 'name', name)}
                        onSelect={(name, defaults) => handleAutocomplete(row.key, name, defaults)}
                      />
                      <button
                        onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                        className="p-2 text-muted-foreground hover:text-status-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {row.autoFilled && (
                      <p className="text-[11px] text-primary flex items-center gap-1">
                        <Info className="w-3 h-3" /> Значения заполнены автоматически — проверьте по бланку
                      </p>
                    )}
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <input
                          value={row.value}
                          onChange={(e) => updateRow(row.key, 'value', e.target.value.replace(',', '.'))}
                          onBlur={() => setTouched(p => ({ ...p, [`${row.key}-value`]: true }))}
                          inputMode="decimal"
                          placeholder="Значение"
                          className={`w-full px-3 py-2 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none ${
                            valErr ? 'border-status-danger' : 'border-border'
                          }`}
                        />
                        {valErr && <p className="text-[10px] text-status-danger mt-0.5">{valErr}</p>}
                      </div>
                      <UnitSelector
                        value={row.unit}
                        onChange={(u) => updateRow(row.key, 'unit', u)}
                        error={touched[`${row.key}-unit`] && !row.unit}
                      />
                      <input
                        value={row.refMin}
                        onChange={(e) => updateRow(row.key, 'refMin', e.target.value.replace(',', '.'))}
                        inputMode="decimal"
                        placeholder="Мин"
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                      <input
                        value={row.refMax}
                        onChange={(e) => updateRow(row.key, 'refMax', e.target.value.replace(',', '.'))}
                        inputMode="decimal"
                        placeholder="Макс"
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setRows((prev) => [...prev, emptyRow()])}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary border border-border rounded-xl px-4 py-2.5"
          >
            <Plus className="w-4 h-4" /> Добавить показатель
          </motion.button>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-card border-t border-border"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.08 }}
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Сохранить
        </motion.button>
      </div>
    </div>
  );
}
