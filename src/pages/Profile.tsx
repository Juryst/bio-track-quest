import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Info, X, Plus } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { useTelegramSdk } from '@/hooks/useTelegramSdk';
import { Sex } from '@/types';
import { toast } from 'sonner';

const conditionOptions = [
  'Диабет 2 типа', 'Гипотиреоз', 'Гипертония', 'Анемия', 'Аутоиммунные заболевания',
];

export default function ProfilePage() {
  const { user } = useTelegramSdk();
  const { profile, updateProfile } = useProfileStore();
  const [dob, setDob] = useState(profile.dob || '');
  const [sex, setSex] = useState<Sex | undefined>(profile.sex);
  const [conditions, setConditions] = useState<string[]>(profile.conditions);
  const [medications, setMedications] = useState<string[]>(profile.medications);
  const [medInput, setMedInput] = useState('');

  const toggleCondition = (c: string) => {
    setConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const addMedication = () => {
    if (medInput.trim() && !medications.includes(medInput.trim())) {
      setMedications((prev) => [...prev, medInput.trim()]);
      setMedInput('');
    }
  };

  const handleSave = () => {
    updateProfile({ dob: dob || undefined, sex, conditions, medications });
    toast.success('Профиль сохранён');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
          <User className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">{user.firstName} {user.lastName}</h2>
      </div>

      <div className="px-5 space-y-5">
        {/* DOB */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата рождения</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Пол</label>
          <div className="flex rounded-xl border border-border overflow-hidden">
            {(['male', 'female'] as Sex[]).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  sex === s ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
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
            {conditionOptions.map((c) => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  conditions.includes(c) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Препараты и добавки</label>
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
              placeholder="Введите название..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={addMedication} className="px-3 py-2.5 rounded-xl bg-secondary">
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Info callout */}
        <div className="flex gap-2 p-3 rounded-xl bg-secondary">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Эти данные помогают AI точнее анализировать результаты и не передаются третьим лицам
          </p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-card border-t border-border safe-bottom">
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
