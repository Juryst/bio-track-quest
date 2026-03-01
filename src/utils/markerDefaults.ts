export interface MarkerDefault {
  unit: string;
  refLow: number;
  refHigh: number;
}

export const MARKER_DEFAULTS: Record<string, MarkerDefault> = {
  "Гемоглобин": { unit: "г/л", refLow: 120, refHigh: 160 },
  "Глюкоза": { unit: "ммоль/л", refLow: 3.9, refHigh: 6.1 },
  "Общий холестерин": { unit: "ммоль/л", refLow: 0, refHigh: 5.2 },
  "Холестерин ЛПНП": { unit: "ммоль/л", refLow: 0, refHigh: 3.4 },
  "Холестерин ЛПВП": { unit: "ммоль/л", refLow: 1.0, refHigh: 2.1 },
  "Триглицериды": { unit: "ммоль/л", refLow: 0, refHigh: 1.7 },
  "АЛТ": { unit: "Ед/л", refLow: 0, refHigh: 40 },
  "АСТ": { unit: "Ед/л", refLow: 0, refHigh: 40 },
  "Ферритин": { unit: "мкг/л", refLow: 12, refHigh: 150 },
  "ТТГ": { unit: "мМЕ/л", refLow: 0.4, refHigh: 4.0 },
  "Т4 свободный": { unit: "пмоль/л", refLow: 9, refHigh: 22 },
  "Витамин D": { unit: "нмоль/л", refLow: 75, refHigh: 250 },
  "Витамин B12": { unit: "пмоль/л", refLow: 148, refHigh: 616 },
  "Эритроциты": { unit: "×10¹²/л", refLow: 3.9, refHigh: 5.0 },
  "Лейкоциты": { unit: "×10⁹/л", refLow: 4.0, refHigh: 9.0 },
  "Тромбоциты": { unit: "×10⁹/л", refLow: 150, refHigh: 400 },
  "СОЭ": { unit: "мм/ч", refLow: 2, refHigh: 20 },
  "Креатинин": { unit: "мкмоль/л", refLow: 44, refHigh: 97 },
  "Мочевина": { unit: "ммоль/л", refLow: 2.5, refHigh: 8.3 },
  "Железо": { unit: "мкмоль/л", refLow: 9, refHigh: 30 },
  "MCH": { unit: "пг", refLow: 27, refHigh: 33 },
  "Т3 свободный": { unit: "пмоль/л", refLow: 2.6, refHigh: 5.7 },
};

export const MARKER_NAMES = Object.keys(MARKER_DEFAULTS);

export function searchMarkers(query: string): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return MARKER_NAMES.filter(name => name.toLowerCase().includes(q));
}
