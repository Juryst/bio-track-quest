import { create } from 'zustand';
import { Analysis, Marker } from '@/types';
import { mockAnalyses } from '@/mock/data';
import { getAnalysisStatus } from '@/utils/getAnalysisStatus';

interface AnalysisStore {
  analyses: Analysis[];
  addAnalysis: (analysis: Analysis) => void;
  getAnalysesForProfile: (profileId: string) => Analysis[];
  updateMarker: (analysisId: string, markerId: string, data: Partial<Marker>) => void;
  deleteMarker: (analysisId: string, markerId: string) => void;
  restoreMarker: (analysisId: string, marker: Marker, index: number) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  analyses: [...mockAnalyses],
  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [analysis, ...state.analyses],
    })),
  getAnalysesForProfile: (profileId: string) => {
    return get().analyses.filter((a) => (a.profileId || 'self') === profileId);
  },
  updateMarker: (analysisId, markerId, data) =>
    set((state) => ({
      analyses: state.analyses.map((a) => {
        if (a.id !== analysisId) return a;
        const markers = a.markers.map((m) =>
          m.id === markerId ? { ...m, ...data } : m
        );
        return { ...a, markers, status: getAnalysisStatus(markers) };
      }),
    })),
  deleteMarker: (analysisId, markerId) =>
    set((state) => ({
      analyses: state.analyses.map((a) => {
        if (a.id !== analysisId) return a;
        const markers = a.markers.filter((m) => m.id !== markerId);
        return { ...a, markers, status: getAnalysisStatus(markers) };
      }),
    })),
  restoreMarker: (analysisId, marker, index) =>
    set((state) => ({
      analyses: state.analyses.map((a) => {
        if (a.id !== analysisId) return a;
        const markers = [...a.markers];
        markers.splice(index, 0, marker);
        return { ...a, markers, status: getAnalysisStatus(markers) };
      }),
    })),
}));
