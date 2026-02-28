import { create } from 'zustand';
import { FamilyProfile } from '@/types';

interface ProfilesStore {
  profiles: FamilyProfile[];
  activeProfileId: string;
  addProfile: (profile: Omit<FamilyProfile, 'id'>) => void;
  switchProfile: (id: string) => void;
  updateProfile: (id: string, data: Partial<FamilyProfile>) => void;
  deleteProfile: (id: string) => void;
}

const defaultProfiles: FamilyProfile[] = [
  {
    id: 'self',
    name: 'Я',
    relation: 'self',
    conditions: [],
    medications: [],
    supplements: [],
    isDefault: true,
  },
  {
    id: 'mom',
    name: 'Мама',
    relation: 'parent',
    sex: 'female',
    dob: '1968-03-15',
    conditions: ['Гипертония'],
    medications: [],
    supplements: [],
    isDefault: false,
  },
];

export const useProfilesStore = create<ProfilesStore>((set) => ({
  profiles: defaultProfiles,
  activeProfileId: 'self',
  addProfile: (profile) =>
    set((state) => ({
      profiles: [...state.profiles, { ...profile, id: Math.random().toString(36).slice(2) }],
    })),
  switchProfile: (id) => set({ activeProfileId: id }),
  updateProfile: (id, data) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deleteProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      activeProfileId: state.activeProfileId === id ? 'self' : state.activeProfileId,
    })),
}));
