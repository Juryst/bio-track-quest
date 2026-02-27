import { create } from 'zustand';
import { Analysis } from '@/types';
import { mockAnalyses } from '@/mock/data';

interface AnalysisStore {
  analyses: Analysis[];
  addAnalysis: (analysis: Analysis) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analyses: [...mockAnalyses],
  addAnalysis: (analysis) => set((state) => ({
    analyses: [analysis, ...state.analyses],
  })),
}));
