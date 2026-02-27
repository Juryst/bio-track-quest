import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, FileText, AlertCircle } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useProfileStore } from '@/store/useProfileStore';
import { StatusBadge } from '@/components/StatusBadge';
import { MarkerRow } from '@/components/MarkerRow';
import { BottomSheet } from '@/components/BottomSheet';
import { generateMockAiReview } from '@/utils/generateMockAiReview';
import { Marker } from '@/types';
import { toast } from 'sonner';

const tabs = ['Показатели', 'AI-обзор', 'Оригинал'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const analysis = useAnalysisStore((s) => s.analyses.find((a) => a.id === id));
  const profile = useProfileStore((s) => s.profile);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary', 'concerns']));

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Анализ не найден</p>
      </div>
    );
  }

  const aiReview = generateMockAiReview(analysis, profile);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const reviewSections = [
    { key: 'summary', title: 'Резюме', content: aiReview.summary, type: 'text' as const },
    { key: 'concerns', title: 'На что обратить внимание', content: aiReview.concerns, type: 'list' as const },
    { key: 'trends', title: 'Тенденции', content: aiReview.trends, type: 'list' as const },
    { key: 'nextSteps', title: 'Следующие шаги', content: aiReview.nextSteps, type: 'list' as const },
    { key: 'questions', title: 'Вопросы врачу', content: aiReview.questionsForDoctor, type: 'list' as const },
  ].filter((s) => s.type === 'text' ? s.content : (s.content as string[]).length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-border bg-card sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">{analysis.type}</h1>
          <p className="text-xs text-muted-foreground">{formatDate(analysis.date)} · {analysis.lab}</p>
        </div>
        <StatusBadge status={analysis.status} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
              activeTab === i ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {tab}
            {activeTab === i && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        {activeTab === 0 && (
          <div className="bg-card rounded-b-xl">
            {analysis.markers.map((marker) => (
              <MarkerRow key={marker.id} marker={marker} onTap={() => setSelectedMarker(marker)} />
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div className="p-4 space-y-3">
            {reviewSections.map((section) => (
              <div key={section.key} className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">{section.title}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.has(section.key) ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.has(section.key) && (
                  <div className="px-4 pb-3">
                    {section.type === 'text' ? (
                      <p className="text-sm text-foreground leading-relaxed">{section.content as string}</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {(section.content as string[]).map((item, i) => (
                          <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                            <span className="text-muted-foreground mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Disclaimer */}
            <div className="flex gap-2 p-3 rounded-xl bg-status-warning-bg border border-status-warning/20">
              <AlertCircle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">{aiReview.disclaimer}</p>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="p-4 space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">analysis_{analysis.id}.pdf</p>
                  <p className="text-xs text-muted-foreground">1.2 МБ · Загружен {formatDate(analysis.date)}</p>
                </div>
              </div>
              <div className="h-40 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <FileText className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <button
                onClick={() => toast.info('Файл недоступен в демо-режиме')}
                className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground"
              >
                Открыть файл
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bottom Sheet for marker detail */}
      <BottomSheet open={!!selectedMarker} onClose={() => setSelectedMarker(null)}>
        {selectedMarker && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{selectedMarker.name}</h3>
              <StatusBadge status={selectedMarker.status} size="md" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-foreground">{selectedMarker.value}</span>
              <span className="text-sm text-muted-foreground">{selectedMarker.unit}</span>
            </div>
            {selectedMarker.referenceRange && (
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Референсный диапазон</p>
                <p className="text-sm font-mono font-medium text-foreground">
                  {selectedMarker.referenceRange.low} – {selectedMarker.referenceRange.high} {selectedMarker.referenceRange.unit}
                </p>
              </div>
            )}
            <p className="text-sm text-foreground leading-relaxed">
              {selectedMarker.status === 'low' && `Значение ${selectedMarker.name} ниже нормы. Это может указывать на дефицит или нарушение. Рекомендуется обратиться к врачу.`}
              {selectedMarker.status === 'high' && `Значение ${selectedMarker.name} выше нормы. Рекомендуется повторить анализ и проконсультироваться со специалистом.`}
              {selectedMarker.status === 'borderline' && `Значение ${selectedMarker.name} находится на границе нормы. Стоит обратить внимание при следующем обследовании.`}
              {selectedMarker.status === 'normal' && `Значение ${selectedMarker.name} в пределах нормы. Продолжайте регулярно сдавать анализы.`}
            </p>
            <button
              onClick={() => {
                setSelectedMarker(null);
                navigate(`/analysis/${id}/marker/${selectedMarker.canonicalName}`);
              }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Посмотреть динамику
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
