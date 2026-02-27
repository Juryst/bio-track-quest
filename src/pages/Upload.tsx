import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, PenLine, Bot } from 'lucide-react';

const options = [
  {
    icon: Upload,
    title: 'Загрузить файл',
    desc: 'PDF, JPG или PNG — мы распознаем данные',
    path: '/upload/verify',
    color: 'text-primary',
  },
  {
    icon: PenLine,
    title: 'Ввести вручную',
    desc: 'Заполните показатели из бланка',
    path: '/upload/manual',
    color: 'text-status-warning',
  },
  {
    icon: Bot,
    title: 'Через бота',
    desc: 'Отправьте фото боту в Telegram',
    path: '/upload/bot',
    color: 'text-status-normal',
  },
];

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Добавить анализ</h1>
      </div>

      <div className="p-5 space-y-3">
        {options.map((opt, i) => (
          <motion.button
            key={opt.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => {
              if (opt.path === '/upload/bot') {
                navigate('/upload/bot');
              } else {
                navigate(opt.path);
              }
            }}
            className="w-full text-left flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <opt.icon className={`w-5 h-5 ${opt.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{opt.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
