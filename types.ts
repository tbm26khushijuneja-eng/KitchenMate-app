export enum AppStep {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DIETARY = 'DIETARY',
  MOOD = 'MOOD',
  INGREDIENTS = 'INGREDIENTS',
  MEAL_TYPE = 'MEAL_TYPE',
  DIFFICULTY = 'DIFFICULTY',
  GOALS = 'GOALS',
  CUISINE = 'CUISINE',
  RESULTS = 'RESULTS',
  PROFILE = 'PROFILE',
}

export interface Rating {
  dishName: string;
  stars: number;
  comment?: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: string;
  email: string;
  dietary: string;
  mood: string;
  ingredients: string[];
  mealType: string;
  difficulty: string;
  goals: string[];
  cuisine: string;
  ratings: Rating[];
}

export interface Recipe {
  name: string;
  description: string;
  cookingTimeMinutes: number;
  ingredients: string[];
  steps: string[];
  matchReason: string;
  imageKeyword: string; // New field for accurate image generation
}