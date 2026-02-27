import { create } from 'zustand';
import { Profile, Sex } from '@/types';

interface ProfileStore {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    conditions: [],
    medications: [],
  },
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates },
  })),
}));
