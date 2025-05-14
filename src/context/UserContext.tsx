import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, WeightEntry, Achievement } from '../types';

interface UserContextType {
  user: User | null;
  weightHistory: WeightEntry[];
  achievements: Achievement[];
  addWeightEntry: (entry: WeightEntry) => void;
  updateUser: (userData: Partial<User>) => void;
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample initial data
const initialUser: User = {
  id: '1',
  name: 'Aiko',
  weight: 70,
  goalWeight: 65,
  dailyCalorieGoal: 2000
};

const initialWeightHistory: WeightEntry[] = [
  { date: '2025-01-01', weight: 72 },
  { date: '2025-01-08', weight: 71 },
  { date: '2025-01-15', weight: 70 },
];

const initialAchievements: Achievement[] = [
  {
    id: 'first-workout',
    title: 'First Workout',
    description: 'Complete your first workout',
    icon: 'dumbbell',
    unlocked: true,
  },
  {
    id: 'streak-3',
    title: 'Dedicated Trainee',
    description: 'Complete workouts for 3 days in a row',
    icon: 'flame',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'weight-milestone-1',
    title: 'Weight Milestone',
    description: 'Reach your first weight milestone',
    icon: 'scale',
    unlocked: false,
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'calorie-master',
    title: 'Calorie Master',
    description: 'Track your calories for 7 consecutive days',
    icon: 'apple',
    unlocked: false,
    progress: 3,
    maxProgress: 7
  },
  {
    id: 'power-up',
    title: 'Power Up',
    description: 'Increase strength in any exercise by 20%',
    icon: 'zap',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(initialWeightHistory);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  const addWeightEntry = (entry: WeightEntry) => {
    // Add entry and sort by date
    setWeightHistory(prev => [...prev, entry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    // Update current user weight
    setUser(prev => ({ ...prev, weight: entry.weight }));
    
    // Check for achievements
    checkWeightAchievements(entry.weight);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === id ? { ...achievement, unlocked: true } : achievement
    ));
  };

  const updateAchievementProgress = (id: string, progress: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === id) {
        const updatedAchievement = { 
          ...achievement, 
          progress: Math.min(progress, achievement.maxProgress || progress)
        };
        
        // Unlock if progress meets or exceeds maxProgress
        if (updatedAchievement.progress >= (updatedAchievement.maxProgress || 0)) {
          updatedAchievement.unlocked = true;
        }
        
        return updatedAchievement;
      }
      return achievement;
    }));
  };

  const checkWeightAchievements = (currentWeight: number) => {
    // Check if user has lost weight compared to starting weight
    const initialWeight = weightHistory[0]?.weight;
    if (initialWeight && currentWeight < initialWeight) {
      const percentLost = (initialWeight - currentWeight) / initialWeight * 100;
      if (percentLost >= 5) {
        unlockAchievement('weight-milestone-1');
      }
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      weightHistory, 
      achievements, 
      addWeightEntry, 
      updateUser, 
      unlockAchievement,
      updateAchievementProgress 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};