import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, FileText, Info, CircleCheck, MessageCircleQuestion } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { StatusBadge } from '@/components/StatusBadge';
import { MarkerRow } from '@/components/MarkerRow';
import { BottomSheet } from '@/components/BottomSheet';
import { ValueScaleBar } from '@/components/ValueScaleBar';
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
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Анализ не найден</p>
      </div>
    );
  }

  const aiReview = generateMockAiReview(analysis);

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const statusValueColor =
    selectedMarker?.status === 'low' || selectedMarker?.status === 'high'
      ? 'text-status-danger'
      : selectedMarker?.status === 'borderline'
        ? 'text-status-warning'
        : 'text-status-normal';

  return (
    <div className="min-h-screen bg-background pb-20">
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
        {/* Показатели */}
        {activeTab === 0 && (
          <div className="bg-card rounded-b-xl">
            {analysis.markers.map((marker) => (
              <MarkerRow key={marker.id} marker={marker} onTap={() => setSelectedMarker(marker)} />
            ))}
          </div>
        )}

        {/* AI-обзор */}
        {activeTab === 1 && (
          <div className="p-4 space-y-3">
            {/* Summary - always visible */}
            <div className="rounded-[10px] bg-primary/5 border-l-4 border-l-primary p-3.5">
              <p className="text-xs font-semibold text-primary mb-1.5">Резюме</p>
              <p className="text-sm text-foreground leading-relaxed">{aiReview.summary}</p>
            </div>

            {/* Concerns */}
            {aiReview.concerns.length > 0 && (
              <div className="rounded-[10px] bg-card border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden">
                <button
                  onClick={() => toggleSection('concerns')}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">На что обратить внимание</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!collapsedSections.has('concerns') ? 'rotate-180' : ''}`} />
                </button>
                {!collapsedSections.has('concerns') && (
                  <ul className="px-4 pb-3 space-y-2">
                    {aiReview.concerns.map((item, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                        <span className="text-status-warning mt-0.5 shrink-0">⚠️</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Trends */}
            {aiReview.trends.length > 0 && (
              <div className="rounded-[10px] bg-card border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden">
                <button
                  onClick={() => toggleSection('trends')}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">Тенденции</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!collapsedSections.has('trends') ? 'rotate-180' : ''}`} />
                </button>
                {!collapsedSections.has('trends') && (
                  <ul className="px-4 pb-3 space-y-2">
                    {aiReview.trends.map((item, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                        <span className="text-muted-foreground mt-0.5 shrink-0">📈</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Next Steps */}
            {aiReview.nextSteps.length > 0 && (
              <div className="rounded-[10px] bg-card border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden">
                <button
                  onClick={() => toggleSection('nextSteps')}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">Следующие шаги</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!collapsedSections.has('nextSteps') ? 'rotate-180' : ''}`} />
                </button>
                {!collapsedSections.has('nextSteps') && (
                  <ul className="px-4 pb-3 space-y-2">
                    {aiReview.nextSteps.map((item, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                        <CircleCheck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Questions for Doctor */}
            {aiReview.questionsForDoctor.length > 0 && (
              <div className="rounded-[10px] bg-card border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden">
                <button
                  onClick={() => toggleSection('questions')}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">Вопросы врачу</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!collapsedSections.has('questions') ? 'rotate-180' : ''}`} />
                </button>
                {!collapsedSections.has('questions') && (
                  <ul className="px-4 pb-3 space-y-2">
                    {aiReview.questionsForDoctor.map((item, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                        <MessageCircleQuestion className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex gap-2 p-3 rounded-lg bg-status-warning-bg text-[12px]">
              <Info className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed">
                ⓘ Это информационная поддержка, а не медицинский диагноз. Проконсультируйтесь с врачом.
              </p>
            </div>
          </div>
        )}

        {/* Оригинал */}
        {activeTab === 2 && (
          <div className="p-4 space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">analysis_{analysis.id}.pdf</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    1.2 МБ · Загружен {formatDate(analysis.date)} · {analysis.lab}
                  </p>
                </div>
              </div>
              <div className="h-[120px] rounded-lg bg-secondary flex items-center justify-center mb-3">
                <FileText className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <button
                onClick={() => toast.info('Файл недоступен в демо-режиме')}
                className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                disabled
              >
                Открыть файл
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                В реальном приложении здесь будет предпросмотр PDF или фото бланка
              </p>
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
              <div className="mt-1"><StatusBadge status={selectedMarker.status} size="md" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-mono font-bold ${statusValueColor}`}>{selectedMarker.value}</span>
              <span className="text-sm text-muted-foreground">{selectedMarker.unit}</span>
            </div>

            {/* Visual scale bar */}
            {selectedMarker.referenceRange && (
              <ValueScaleBar
                value={selectedMarker.value}
                referenceRange={selectedMarker.referenceRange}
                status={selectedMarker.status}
              />
            )}

            {selectedMarker.referenceRange && (
              <div className="p-3 rounded-lg bg-secondary border border-border">
                <p className="text-xs text-muted-foreground mb-1">Референсный диапазон</p>
                <p className="text-sm font-mono font-medium text-foreground">
                  {selectedMarker.referenceRange.low} – {selectedMarker.referenceRange.high} {selectedMarker.referenceRange.unit}
                </p>
              </div>
            )}
            <p className="text-sm text-foreground leading-relaxed">
              💡{' '}
              {selectedMarker.status === 'low' && `Значение ${selectedMarker.name} ниже референсного диапазона. Это может указывать на дефицит или нарушение. Рекомендуется обратиться к врачу.`}
              {selectedMarker.status === 'high' && `Значение ${selectedMarker.name} выше референсного диапазона. Рекомендуется повторить анализ и проконсультироваться со специалистом.`}
              {selectedMarker.status === 'borderline' && `Значение ${selectedMarker.name} находится на границе нормы. Стоит обратить внимание при следующем обследовании.`}
              {selectedMarker.status === 'normal' && `Значение ${selectedMarker.name} в пределах нормы. Продолжайте регулярно сдавать анализы.`}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.08 }}
              onClick={() => {
                setSelectedMarker(null);
                navigate(`/analysis/${id}/marker/${selectedMarker.canonicalName}`);
              }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Посмотреть динамику
            </motion.button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
