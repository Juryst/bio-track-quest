import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Info, X, Plus, Check, Moon, Sun } from 'lucide-react';
import { useProfilesStore } from '@/store/useProfilesStore';
import { useTelegramSdk } from '@/hooks/useTelegramSdk';
import { Sex } from '@/types';
import { toast } from 'sonner';

const conditionOptions = [
  'Диабет 2 типа', 'Гипотиреоз', 'Гипертония', 'Анемия', 'Аутоиммунные заболевания',
];

export default function ProfilePage() {
  const { user } = useTelegramSdk();
  const { profiles, activeProfileId, updateProfile } = useProfilesStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const [dob, setDob] = useState(activeProfile?.dob || '');
  const [sex, setSex] = useState<Sex | undefined>(activeProfile?.sex);
  const [conditions, setConditions] = useState<string[]>(activeProfile?.conditions || []);
  const [medications, setMedications] = useState<string[]>(activeProfile?.medications || []);
  const [supplements, setSupplements] = useState<string[]>(activeProfile?.supplements || []);
  const [medInput, setMedInput] = useState('');
  const [suppInput, setSuppInput] = useState('');

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const toggleCondition = (c: string) => {
    setConditions((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const addMedication = () => {
    if (medInput.trim() && !medications.includes(medInput.trim())) {
      setMedications((prev) => [...prev, medInput.trim()]);
      setMedInput('');
    }
  };

  const addSupplement = () => {
    if (suppInput.trim() && !supplements.includes(suppInput.trim())) {
      setSupplements((prev) => [...prev, suppInput.trim()]);
      setSuppInput('');
    }
  };

  const handleSave = () => {
    if (activeProfileId) {
      updateProfile(activeProfileId, {
        dob: dob || undefined,
        sex,
        conditions,
        medications,
        supplements,
      });
    }
    toast.success('Профиль сохранён');
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      <div className="px-5 pt-6 pb-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
          <User className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          {activeProfile?.relation === 'self'
            ? `${user.firstName} ${user.lastName}`
            : activeProfile?.name || 'Профиль'}
        </h2>
      </div>

      <div className="px-5 space-y-5">
        {/* DOB */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата рождения</label>
          <input
            type="date"
            lang="ru"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="дд.мм.гггг"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Sex - Segmented Control */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Пол</label>
          <div className="flex rounded-[10px] bg-muted p-1">
            {(['male', 'female'] as Sex[]).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  sex === s
                    ? 'bg-card text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                    : 'text-muted-foreground'
                }`}
              >
                {s === 'male' ? 'Мужской' : 'Женский'}
              </button>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Хронические заболевания</label>
          <div className="flex flex-wrap gap-2">
            {conditionOptions.map((c) => {
              const selected = conditions.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCondition(c)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    selected
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-transparent border-border text-muted-foreground'
                  }`}
                >
                  {selected && <Check className="w-3 h-3" />}
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Medications */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Препараты</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {medications.map((m) => (
              <span key={m} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                {m}
                <button onClick={() => setMedications((prev) => prev.filter((x) => x !== m))}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={medInput}
              onChange={(e) => setMedInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMedication()}
              placeholder="Название препарата..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={addMedication} className="px-3 py-2.5 rounded-xl bg-secondary">
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Supplements */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">БАДы и витамины</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {supplements.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                {s}
                <button onClick={() => setSupplements((prev) => prev.filter((x) => x !== s))}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={suppInput}
              onChange={(e) => setSuppInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSupplement()}
              placeholder="Название добавки..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={addSupplement} className="px-3 py-2.5 rounded-xl bg-secondary">
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
          <div className="flex items-center gap-2.5">
            {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
            <span className="text-sm font-medium text-foreground">Тёмная тема</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isDark ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform duration-200 ${isDark ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {/* Info callout */}
        <div className="flex gap-2 p-3 rounded-xl bg-secondary">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Эти данные помогают AI точнее анализировать результаты и не передаются третьим лицам
          </p>
        </div>
      </div>

      {/* Save button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-card border-t border-border"
        style={{ paddingBottom: 'calc(56px + 16px + env(safe-area-inset-bottom, 0px))' }}
      >
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
