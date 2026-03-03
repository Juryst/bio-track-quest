import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useProfilesStore } from '@/store/useProfilesStore';
import { StatusBadge } from '@/components/StatusBadge';
import { BottomSheet } from '@/components/BottomSheet';
import { MarkerStatus } from '@/types';

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatDateFull(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const statusColor: Record<MarkerStatus, string> = {
  normal: 'hsl(142, 71%, 35%)',
  borderline: 'hsl(37, 91%, 55%)',
  low: 'hsl(0, 72%, 51%)',
  high: 'hsl(0, 72%, 51%)',
  unknown: 'hsl(220, 9%, 60%)',
};

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  return (
    <circle
      cx={cx} cy={cy} r={5}
      fill={statusColor[payload.status as MarkerStatus] || '#999'}
      stroke="hsl(var(--card))" strokeWidth={2}
    />
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-2.5 shadow-lg text-xs">
      <p className="font-medium text-foreground">{formatDateFull(d.date)}</p>
      <p className="font-mono font-semibold mt-1">{d.value} {d.unit}</p>
      <div className="mt-1"><StatusBadge status={d.status} /></div>
    </div>
  );
}

export default function Dynamics() {
  const { canonicalName: paramCanonical } = useParams<{ canonicalName: string }>();
  const activeProfileId = useProfilesStore((s) => s.activeProfileId);
  const allAnalyses = useAnalysisStore((s) => s.analyses);
  const analyses = useMemo(() => allAnalyses.filter((a) => (a.profileId || 'self') === activeProfileId), [allAnalyses, activeProfileId]);
  const [search, setSearch] = useState('');
  const [selectorOpen, setSelectorOpen] = useState(false);

  const allMarkers = useMemo(() => {
    const seen = new Map<string, { name: string; category: string; count: number; hasAbnormal: boolean }>();
    for (const a of analyses) {
      for (const m of a.markers) {
        const prev = seen.get(m.canonicalName);
        if (prev) {
          prev.count++;
          if (m.status !== 'normal') prev.hasAbnormal = true;
        } else {
          seen.set(m.canonicalName, { name: m.name, category: a.type, count: 1, hasAbnormal: m.status !== 'normal' });
        }
      }
    }
    return Array.from(seen.entries()).map(([cn, d]) => ({ canonicalName: cn, ...d }));
  }, [analyses]);

  const defaultMarker = useMemo(() => {
    if (paramCanonical) return paramCanonical;
    const multiPoint = allMarkers.filter(m => m.count >= 2);
    const abnormalMulti = multiPoint.find(m => m.hasAbnormal);
    return abnormalMulti?.canonicalName || multiPoint[0]?.canonicalName || allMarkers[0]?.canonicalName || '';
  }, [paramCanonical, allMarkers]);

  const [selectedCanonical, setSelectedCanonical] = useState(defaultMarker);
  const selectedInfo = allMarkers.find((m) => m.canonicalName === selectedCanonical);

  const history = useMemo(() => {
    const points: any[] = [];
    for (const a of analyses) {
      for (const m of a.markers) {
        if (m.canonicalName === selectedCanonical) {
          points.push({
            date: a.date, value: m.value, status: m.status,
            lab: a.lab && a.lab !== 'Не указана' ? a.lab : '', unit: m.unit,
            refLow: m.referenceRange?.low, refHigh: m.referenceRange?.high,
          });
        }
      }
    }
    return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [analyses, selectedCanonical]);

  const refLow = history[0]?.refLow;
  const refHigh = history[0]?.refHigh;
  const unit = history[0]?.unit || '';

  const { yMin, yMax } = useMemo(() => {
    if (history.length === 0) return { yMin: 0, yMax: 100 };
    const values = history.map((d: any) => d.value);
    const allPoints = [...values, ...(refLow != null ? [refLow] : []), ...(refHigh != null ? [refHigh] : [])];
    const dataMin = Math.min(...allPoints);
    const dataMax = Math.max(...allPoints);
    const padding = Math.max((dataMax - dataMin) * 0.25, 2);
    return { yMin: Math.floor(dataMin - padding), yMax: Math.ceil(dataMax + padding) };
  }, [history, refLow, refHigh]);

  const trendSummary = useMemo(() => {
    if (history.length < 2) return null;
    const first = history[0];
    const last = history[history.length - 1];
    const delta = last.value - first.value;

    const sev: Record<string, number> = { normal: 0, borderline: 1, low: 2, high: 2, unknown: 0 };
    const firstSev = sev[first.status] || 0;
    const lastSev = sev[last.status] || 0;

    let trend: 'worsening' | 'improving' | 'stable';
    if (lastSev > firstSev) trend = 'worsening';
    else if (lastSev < firstSev) trend = 'improving';
    else if (Math.abs(delta) < 0.5) trend = 'stable';
    else {
      if (refLow != null && last.value < refLow) trend = delta < 0 ? 'worsening' : 'improving';
      else if (refHigh != null && last.value > refHigh) trend = delta > 0 ? 'worsening' : 'improving';
      else trend = 'stable';
    }

    const arrow = trend === 'worsening' ? '↓' : trend === 'improving' ? '↑' : '→';
    const color = trend === 'worsening' ? 'text-status-danger' : trend === 'improving' ? 'text-status-normal' : 'text-muted-foreground';
    const sign = delta > 0 ? '+' : '';
    return { arrow, color, sign, delta, firstDate: first.date, lastDate: last.date };
  }, [history, refLow, refHigh]);

  const filteredMarkers = allMarkers.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const grouped = filteredMarkers.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, typeof allMarkers>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">Динамика</h1>
      </div>

      {/* Marker selector trigger */}
      <div className="px-5 mb-4">
        <button
          onClick={() => setSelectorOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card"
        >
          <span className="text-sm font-medium text-foreground">{selectedInfo?.name || 'Выберите показатель'}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${selectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Marker selector BottomSheet */}
      <BottomSheet open={selectorOpen} onClose={() => { setSelectorOpen(false); setSearch(''); }}>
        <h3 className="text-base font-semibold text-foreground mb-3">Выберите показатель</h3>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary mb-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto -mx-2">
          {Object.entries(grouped).map(([category, markers]) => (
            <div key={category}>
              <p className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/50">{category}</p>
              {markers.map((m) => (
                <button
                  key={m.canonicalName}
                  onClick={() => { setSelectedCanonical(m.canonicalName); setSelectorOpen(false); setSearch(''); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors active:bg-accent ${
                    m.canonicalName === selectedCanonical ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  {m.name}
                  {m.count >= 2 && <span className="ml-2 text-xs text-muted-foreground">({m.count})</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </BottomSheet>

      {trendSummary && (
        <div className="mx-5 mb-3 flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] bg-secondary dark:bg-secondary/50">
          <span className={`text-base font-bold ${trendSummary.color}`}>{trendSummary.arrow}</span>
          <span className={`text-sm font-semibold ${trendSummary.color}`}>
            {trendSummary.sign}{trendSummary.delta.toFixed(1)} {unit}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateShort(trendSummary.firstDate)} — {formatDateShort(trendSummary.lastDate)}
          </span>
        </div>
      )}

      {history.length < 2 ? (
        <div className="mx-5 p-6 rounded-xl bg-card border border-border text-center">
          <AlertTriangle className="w-8 h-8 text-status-warning mx-auto mb-2" />
          <p className="text-sm text-foreground font-medium">Недостаточно данных</p>
          <p className="text-xs text-muted-foreground mt-1">Добавьте минимум 2 анализа с этим показателем</p>
          {allMarkers.filter(m => m.count >= 2).length > 0 && (
            <p className="text-xs text-primary mt-3 font-medium">
              Показатели с динамикой: {allMarkers.filter(m => m.count >= 2).map(m => m.name).join(', ')}
            </p>
          )}
        </div>
      ) : (
        <div className="mx-5 p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-2">{selectedInfo?.name}, {unit}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              {refLow != null && refHigh != null && (
                <ReferenceArea y1={refLow} y2={refHigh} fill="hsl(142,71%,45%)" fillOpacity={0.08} />
              )}
              {refLow != null && <ReferenceLine y={refLow} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeOpacity={0.5} />}
              {refHigh != null && <ReferenceLine y={refHigh} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeOpacity={0.5} />}
              <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis domain={[yMin, yMax]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={<CustomDot />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {history.length > 0 && (
        <div className="mx-5 mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <p className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            История значений
          </p>
          {history.slice().reverse().map((point, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border/30 last:border-b-0">
              <div>
                <p className="text-sm text-foreground">{formatDateFull(point.date)}</p>
                {point.lab && <p className="text-xs text-muted-foreground">{point.lab}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-semibold text-foreground">{point.value} {point.unit}</span>
                <StatusBadge status={point.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
