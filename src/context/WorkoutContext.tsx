import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WorkoutPlan, Exercise } from '../types';
import { useUser } from './UserContext';

// Sample workout plans
const initialWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'strength-1',
    name: 'Beginner Strength Training',
    description: 'Perfect for beginners to build foundational strength',
    difficulty: 'beginner',
    targetMuscleGroups: ['chest', 'back', 'legs', 'arms'],
    duration: 30,
    exercises: [
      {
        id: 'pushups-1',
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        muscleGroup: 'chest',
        description: 'Classic chest exercise for upper body strength'
      },
      {
        id: 'squats-1',
        name: 'Bodyweight Squats',
        sets: 3,
        reps: 15,
        muscleGroup: 'legs',
        description: 'Foundational leg exercise to build lower body strength'
      },
      {
        id: 'rows-1',
        name: 'Dumbbell Rows',
        sets: 3,
        reps: 12,
        muscleGroup: 'back',
        description: 'Back strengthening exercise using light dumbbells'
      }
    ]
  },
  {
    id: 'hiit-1',
    name: 'Quick HIIT Cardio',
    description: 'High-intensity interval training for fat burning',
    difficulty: 'intermediate',
    targetMuscleGroups: ['full body', 'cardio'],
    duration: 20,
    exercises: [
      {
        id: 'burpees-1',
        name: 'Burpees',
        sets: 4,
        reps: 10,
        muscleGroup: 'full body',
        description: 'Full body exercise combining squat, push-up, and jump'
      },
      {
        id: 'jumping-jacks-1',
        name: 'Jumping Jacks',
        sets: 4,
        reps: 30,
        muscleGroup: 'cardio',
        description: 'Classic cardio exercise to elevate heart rate'
      },
      {
        id: 'mountain-climbers-1',
        name: 'Mountain Climbers',
        sets: 4,
        reps: 20,
        muscleGroup: 'core',
        description: 'Dynamic core exercise that also raises heart rate'
      }
    ]
  }
];

interface WorkoutContextType {
  workoutPlans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  completedWorkouts: string[]; // IDs of completed workout plans
  selectWorkoutPlan: (id: string) => void;
  completeWorkout: (id: string) => void;
  addCustomPlan: (plan: Omit<WorkoutPlan, 'id'>) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(initialWorkoutPlans);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  const { updateAchievementProgress, unlockAchievement } = useUser();

  const selectWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find(plan => plan.id === id) || null;
    setSelectedPlan(plan);
  };

  const completeWorkout = (id: string) => {
    // Record completed workout
    const today = new Date().toISOString().split('T')[0];
    const completionId = `${id}-${today}`;
    
    setCompletedWorkouts(prev => {
      if (prev.includes(completionId)) return prev;
      return [...prev, completionId];
    });
    
    // Update achievements
    if (completedWorkouts.length === 0) {
      unlockAchievement('first-workout');
    }
    
    // Check for streaks
    checkWorkoutStreak();
  };

  const addCustomPlan = (plan: Omit<WorkoutPlan, 'id'>) => {
    const newPlan = {
      ...plan,
      id: `custom-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setWorkoutPlans(prev => [...prev, newPlan]);
  };

  // Helper function to check for workout streaks
  const checkWorkoutStreak = () => {
    const dates = new Set<string>();
    
    // Extract dates from completed workouts
    completedWorkouts.forEach(id => {
      const datePart = id.split('-').slice(-3).join('-');
      dates.add(datePart);
    });
    
    // Count consecutive days
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      if (dates.has(dateString)) {
        streak++;
      } else {
        break;
      }
    }
    
    // Update streak achievement
    updateAchievementProgress('streak-3', streak);
  };

  return (
    <WorkoutContext.Provider value={{ 
      workoutPlans, 
      selectedPlan, 
      completedWorkouts,
      selectWorkoutPlan, 
      completeWorkout,
      addCustomPlan
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};