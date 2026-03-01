import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Search, ChevronDown } from 'lucide-react';
import { UNIT_GROUPS, searchUnits } from '@/utils/unitGroups';

interface UnitSelectorProps {
  value: string;
  onChange: (unit: string) => void;
  error?: boolean;
}

export function UnitSelector({ value, onChange, error }: UnitSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const groups = searchUnits(search);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg border bg-background text-sm transition-colors ${
          error ? 'border-status-danger' : 'border-border'
        } ${value ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <span className="truncate">{value || 'Ед. *'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </button>

      <BottomSheet open={open} onClose={() => { setOpen(false); setSearch(''); }}>
        <h3 className="text-base font-semibold text-foreground mb-3">Единица измерения</h3>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary mb-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск единицы..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto -mx-2">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {g.emoji} {g.label}
              </p>
              {g.units.map((u) => (
                <button
                  key={u}
                  onClick={() => { onChange(u); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors active:bg-accent ${
                    u === value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
