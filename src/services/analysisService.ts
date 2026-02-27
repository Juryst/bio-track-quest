import { Analysis, MarkerHistoryPoint } from '@/types';
import { mockAnalyses } from '@/mock/data';

export function getAnalyses(): Analysis[] {
  return mockAnalyses;
}

export function getAnalysisById(id: string): Analysis | undefined {
  return mockAnalyses.find(a => a.id === id);
}

export function getMarkerHistory(canonicalName: string): MarkerHistoryPoint[] {
  const points: MarkerHistoryPoint[] = [];
  for (const analysis of mockAnalyses) {
    for (const marker of analysis.markers) {
      if (marker.canonicalName === canonicalName) {
        points.push({
          date: analysis.date,
          value: marker.value,
          status: marker.status,
          lab: analysis.lab,
          unit: marker.unit,
          referenceRange: marker.referenceRange,
        });
      }
    }
  }
  return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getAllUniqueMarkers(): { canonicalName: string; name: string; category: string }[] {
  const seen = new Map<string, { name: string; category: string }>();
  for (const analysis of mockAnalyses) {
    const category = analysis.type;
    for (const marker of analysis.markers) {
      if (!seen.has(marker.canonicalName)) {
        seen.set(marker.canonicalName, { name: marker.name, category });
      }
    }
  }
  return Array.from(seen.entries()).map(([canonicalName, { name, category }]) => ({
    canonicalName, name, category,
  }));
}
