import { create } from 'zustand';
import { Analysis } from '@/types';
import { mockAnalyses } from '@/mock/data';

interface AnalysisStore {
  analyses: Analysis[];
  addAnalysis: (analysis: Analysis) => void;
  getAnalysesForProfile: (profileId: string) => Analysis[];
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
}));
