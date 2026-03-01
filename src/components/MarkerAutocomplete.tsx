import { useState, useRef, useEffect } from 'react';
import { searchMarkers, MARKER_DEFAULTS } from '@/utils/markerDefaults';

interface MarkerAutocompleteProps {
  value: string;
  onChange: (name: string) => void;
  onSelect: (name: string, defaults: { unit: string; refLow: number; refHigh: number }) => void;
  placeholder?: string;
}

export function MarkerAutocomplete({ value, onChange, onSelect, placeholder = 'Название' }: MarkerAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 1) {
      setSuggestions(searchMarkers(value).slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((name) => {
            const d = MARKER_DEFAULTS[name];
            return (
              <button
                key={name}
                onClick={() => {
                  onSelect(name, d);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent active:bg-accent flex items-center justify-between"
              >
                <span>{name}</span>
                <span className="text-xs text-muted-foreground">{d.unit}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
