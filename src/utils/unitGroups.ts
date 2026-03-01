export interface UnitGroup {
  emoji: string;
  label: string;
  units: string[];
}

export const UNIT_GROUPS: UnitGroup[] = [
  {
    emoji: '🧪',
    label: 'Концентрация',
    units: ['ммоль/л', 'мкмоль/л', 'г/л', 'мг/л', 'мкг/л', 'нг/л', 'нг/мл', 'пг/мл'],
  },
  {
    emoji: '🩸',
    label: 'Кровь',
    units: ['г/дл', 'мг/дл', '×10⁹/л', '×10¹²/л', '%'],
  },
  {
    emoji: '⚡',
    label: 'Ферменты',
    units: ['Ед/л', 'МЕ/л', 'мкМЕ/мл'],
  },
  {
    emoji: '🦋',
    label: 'Гормоны',
    units: ['мМЕ/л', 'мМЕ/мл', 'нмоль/л', 'пмоль/л', 'нг/дл', 'мкг/дл', 'МЕ/л'],
  },
  {
    emoji: '📏',
    label: 'Прочее',
    units: ['мм/ч', 'мл/мин', 'мл/мин/1,73м²', 'пг'],
  },
  {
    emoji: '∅',
    label: 'Без единиц',
    units: ['(без единиц)'],
  },
];

export const ALL_UNITS = UNIT_GROUPS.flatMap(g => g.units);

export function searchUnits(query: string): UnitGroup[] {
  if (!query.trim()) return UNIT_GROUPS;
  const q = query.toLowerCase();
  return UNIT_GROUPS
    .map(g => ({
      ...g,
      units: g.units.filter(u => u.toLowerCase().includes(q)),
    }))
    .filter(g => g.units.length > 0);
}
