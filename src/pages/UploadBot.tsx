import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const BOT_USERNAME = '@medanalyze_bot';

export default function UploadBot() {
  const navigate = useNavigate();

  const steps = [
    `Откройте бота ${BOT_USERNAME}`,
    'Отправьте PDF, JPG или PNG бланка',
    'Бот обработает и анализ появится здесь',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Через бота</h1>
      </div>

      <div className="p-5 space-y-6">
        <div className="flex flex-col items-center py-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">Telegram-бот</h2>
          <p className="text-sm text-muted-foreground text-center">Отправьте фото анализа боту — он распознает и сохранит</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-foreground">{step}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">Поддерживаются: PDF, JPG, PNG</p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.info('Функция доступна в финальной версии')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-semibold text-foreground"
        >
          <ExternalLink className="w-4 h-4" /> Открыть бота
        </motion.button>

        <div className="p-3 rounded-xl bg-status-warning-bg border border-status-warning-border">
          <p className="text-xs text-foreground">
            ⚠️ Функция в разработке — в демо-режиме не работает
          </p>
        </div>
      </div>
    </div>
  );
}
