export type MarkerStatus = 'normal' | 'low' | 'high' | 'borderline' | 'unknown';
export type AnalysisStatus = 'normal' | 'borderline' | 'abnormal';
export type Sex = 'male' | 'female';
export type ProfileRelation = 'self' | 'spouse' | 'child' | 'parent' | 'other';

export interface ReferenceRange {
  low: number;
  high: number;
  unit: string;
}

export interface Marker {
  id: string;
  name: string;
  canonicalName: string;
  value: number;
  unit: string;
  referenceRange?: ReferenceRange;
  status: MarkerStatus;
}

export interface Analysis {
  id: string;
  profileId?: string;
  type: string;
  lab: string;
  date: string;
  markers: Marker[];
  status: AnalysisStatus;
  fileUrl?: string;
}

export interface Profile {
  dob?: string;
  sex?: Sex;
  conditions: string[];
  medications: string[];
}

export interface FamilyProfile {
  id: string;
  name: string;
  relation: ProfileRelation;
  dob?: string;
  sex?: Sex;
  conditions: string[];
  medications: string[];
  supplements: string[];
  isDefault: boolean;
}

export interface AiReview {
  summary: string;
  concerns: string[];
  trends: string[];
  nextSteps: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface MarkerHistoryPoint {
  date: string;
  value: number;
  status: MarkerStatus;
  lab: string;
  unit: string;
  referenceRange?: ReferenceRange;
}
