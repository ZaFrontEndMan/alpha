export type Gender = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type FitnessGoal = 'aggressive_cut' | 'moderate_cut' | 'maintenance_recomp' | 'lean_bulk' | 'contest_prep';
export type DietPreference = 'balanced' | 'carb_cycling' | 'low_carb_keto';

export interface MacroCalculationResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  proteinCalories: number;
  carbsGrams: number;
  carbsCalories: number;
  fatsGrams: number;
  fatsCalories: number;
  waterLiters: number;
  proteinRatio: number;
  carbsRatio: number;
  fatsRatio: number;
}

export interface TransformationItem {
  id: string;
  name: string;
  category: 'fat_loss' | 'recomp' | 'contest_prep';
  durationWeeks: number;
  weightDelta: string;
  bodyFatDelta: string;
  muscleDelta?: string;
  highlight: string;
  clientQuote: string;
  location: string;
  keyStrategy: string[];
}

export interface CoachingTier {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  popular?: boolean;
  basePriceUSD: number;
  features: string[];
  deliverables: {
    bloodwork: string;
    nutrition: string;
    training: string;
    communication: string;
  };
}

export interface ConsultationFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  age: string;
  currentWeight: string;
  targetGoal: string;
  experienceLevel: string;
  hasRecentBloodwork: boolean;
  medicalConditions: string;
  selectedTier: string;
  preferredTimezone: string;
}
