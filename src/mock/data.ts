import { Analysis, Marker } from '@/types';
import { getMarkerStatus } from '@/utils/getMarkerStatus';
import { getAnalysisStatus } from '@/utils/getAnalysisStatus';

function m(
  id: string, name: string, canonical: string,
  value: number, unit: string,
  low: number, high: number
): Marker {
  const range = { low, high, unit };
  return {
    id, name, canonicalName: canonical,
    value, unit, referenceRange: range,
    status: getMarkerStatus(value, range),
  };
}

const now = new Date();
const monthsAgo = (n: number) => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
};

const analysis4: Analysis = {
  id: 'a4',
  type: 'ОАК',
  lab: 'Гемотест',
  date: monthsAgo(4),
  markers: [
    m('a4-1', 'Гемоглобин', 'hemoglobin', 112, 'г/л', 120, 160),
    m('a4-2', 'Ферритин', 'ferritin', 9, 'мкг/л', 12, 150),
    m('a4-3', 'Лейкоциты', 'leukocytes', 5.8, '×10⁹/л', 4, 9),
    m('a4-4', 'Тромбоциты', 'platelets', 230, '×10⁹/л', 150, 400),
  ],
  status: 'normal',
};
analysis4.status = getAnalysisStatus(analysis4.markers);

const analysis3: Analysis = {
  id: 'a3',
  type: 'Гормоны щитовидки',
  lab: 'Инвитро',
  date: monthsAgo(3),
  markers: [
    m('a3-1', 'ТТГ', 'tsh', 2.1, 'мМЕ/л', 0.4, 4.0),
    m('a3-2', 'Т4 свободный', 'free_t4', 14.2, 'пмоль/л', 9, 22),
    m('a3-3', 'Т3 свободный', 'free_t3', 4.8, 'пмоль/л', 2.6, 5.7),
  ],
  status: 'normal',
};
analysis3.status = getAnalysisStatus(analysis3.markers);

const analysis1: Analysis = {
  id: 'a1',
  type: 'ОАК',
  lab: 'Инвитро',
  date: monthsAgo(2),
  markers: [
    m('a1-1', 'Гемоглобин', 'hemoglobin', 108, 'г/л', 120, 160),
    m('a1-2', 'Ферритин', 'ferritin', 6, 'мкг/л', 12, 150),
    m('a1-3', 'MCH', 'mch', 24, 'пг', 27, 33),
    m('a1-4', 'Эритроциты', 'erythrocytes', 3.8, '×10¹²/л', 3.9, 5.0),
    m('a1-5', 'Лейкоциты', 'leukocytes', 6.2, '×10⁹/л', 4, 9),
    m('a1-6', 'Тромбоциты', 'platelets', 245, '×10⁹/л', 150, 400),
  ],
  status: 'normal',
};
analysis1.status = getAnalysisStatus(analysis1.markers);

const analysis2: Analysis = {
  id: 'a2',
  type: 'Биохимия',
  lab: 'KDL',
  date: monthsAgo(1),
  markers: [
    m('a2-1', 'Глюкоза', 'glucose', 5.9, 'ммоль/л', 3.9, 6.1),
    m('a2-2', 'Холестерин ЛПНП', 'ldl_cholesterol', 3.6, 'ммоль/л', 0, 3.4),
    m('a2-3', 'Общий холестерин', 'total_cholesterol', 5.4, 'ммоль/л', 0, 5.2),
    m('a2-4', 'Холестерин ЛПВП', 'hdl_cholesterol', 1.4, 'ммоль/л', 1.0, 2.1),
    m('a2-5', 'АЛТ', 'alt', 28, 'Ед/л', 0, 40),
    m('a2-6', 'АСТ', 'ast', 22, 'Ед/л', 0, 40),
  ],
  status: 'normal',
};
analysis2.status = getAnalysisStatus(analysis2.markers);

export const mockAnalyses: Analysis[] = [analysis2, analysis1, analysis3, analysis4];
