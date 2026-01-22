
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietGoal = 'lose' | 'maintain' | 'gain';
export type DietType = 'balanced' | 'high_protein' | 'keto' | 'vegan' | 'mediterranean';
export type ProgressPace = 'slow' | 'recommended' | 'fast';

export interface UserAccount {
  email: string;
  password?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  email: string;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  gender: Gender;
  isWeightlifting: boolean;
  activityLevel: ActivityLevel;
  goal: DietGoal;
  pace: ProgressPace;
  dietType?: DietType;
  mealFrequency: number;
  wantsAiDiet: boolean;
  wantsCalorieCounting: boolean;
  favoriteFoods: {
    proteins: string[];
    vegetables: string[];
    carbs: string[];
    fats: string[];
    fruits: string[];
    dairy: string[];
    sauces: string[];
  };
  startDate: string;
  goalDate: string;
  // Gamification & Tracking
  xp: number;
  level: number;
  waterIntake: number; // glasses
  steps: number;
  fastingStart?: string; // ISO string
  weightHistory: { date: string; weight: number }[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface DietPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
  };
}

export interface FoodAnalysis {
  dishName: string;
  estimatedCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  ingredients: string[];
  confidence: number;
}
