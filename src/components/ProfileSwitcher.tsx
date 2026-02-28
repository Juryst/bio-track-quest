import { BottomSheet } from './BottomSheet';
import { useProfilesStore } from '@/store/useProfilesStore';
import { Check, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSwitcherProps {
  open: boolean;
  onClose: () => void;
}

const relationLabels: Record<string, string> = {
  self: 'Я',
  spouse: 'Супруг(а)',
  child: 'Ребёнок',
  parent: 'Родитель',
  other: 'Другое',
};

export function ProfileSwitcher({ open, onClose }: ProfileSwitcherProps) {
  const { profiles, activeProfileId, switchProfile, addProfile } = useProfilesStore();

  const handleAdd = () => {
    const name = prompt('Имя нового профиля:');
    if (!name?.trim()) return;
    addProfile({
      name: name.trim(),
      relation: 'other',
      conditions: [],
      medications: [],
      supplements: [],
      isDefault: false,
    });
    toast.success(`Профиль «${name.trim()}» добавлен`);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-foreground mb-4">Выберите профиль</h3>
      <div className="space-y-1">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              switchProfile(p.id);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-accent active:bg-accent"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {p.name[0]}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm text-foreground ${p.id === activeProfileId ? 'font-bold' : 'font-medium'}`}>
                {p.name}
              </p>
              <p className="text-xs text-muted-foreground">{relationLabels[p.relation] || p.relation}</p>
            </div>
            {p.id === activeProfileId && (
              <Check className="w-4 h-4 text-primary shrink-0" />
            )}
          </button>
        ))}
      </div>
      <button
        onClick={handleAdd}
        className="w-full flex items-center gap-3 px-3 py-3 mt-2 rounded-xl text-primary hover:bg-accent transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Добавить профиль</span>
      </button>
    </BottomSheet>
  );
}
