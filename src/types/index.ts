export interface User {
  id: string;
  name: string;
  weight: number;
  goalWeight: number;
  dailyCalorieGoal: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface CalorieEntry {
  id: string;
  date: string;
  food: string;
  calories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscleGroups: string[];
  duration: number; // in minutes
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  muscleGroup: string;
  description: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}