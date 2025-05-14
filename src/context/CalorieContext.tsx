import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CalorieEntry } from '../types';
import { useUser } from './UserContext';

interface CalorieContextType {
  entries: CalorieEntry[];
  addEntry: (entry: Omit<CalorieEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  getTodaysCalories: () => number;
  getCaloriesForDate: (date: string) => number;
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

// Sample initial data
const initialEntries: CalorieEntry[] = [
  { 
    id: '1', 
    date: new Date().toISOString().split('T')[0], 
    food: 'Rice Bowl', 
    calories: 400, 
    mealType: 'lunch' 
  },
  { 
    id: '2', 
    date: new Date().toISOString().split('T')[0], 
    food: 'Protein Shake', 
    calories: 200, 
    mealType: 'breakfast' 
  }
];

export const CalorieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<CalorieEntry[]>(initialEntries);
  const { updateAchievementProgress } = useUser();

  const addEntry = (entry: Omit<CalorieEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setEntries(prev => [...prev, newEntry]);
    
    // Check if user has tracked calories for today and update achievement
    const today = new Date().toISOString().split('T')[0];
    if (entry.date === today) {
      updateAchievementProgress('calorie-master', 
        getConsecutiveDaysTracked() + 1);
    }
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getTodaysCalories = () => {
    const today = new Date().toISOString().split('T')[0];
    return getCaloriesForDate(today);
  };

  const getCaloriesForDate = (date: string) => {
    return entries
      .filter(entry => entry.date === date)
      .reduce((sum, entry) => sum + entry.calories, 0);
  };

  // Helper function to calculate consecutive days tracked
  const getConsecutiveDaysTracked = () => {
    const days = new Set<string>();
    
    // Add all tracked days to a set
    entries.forEach(entry => days.add(entry.date));
    
    // Convert to array and sort
    const sortedDays = Array.from(days).sort();
    
    // Count consecutive days up to today
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      if (days.has(dateString)) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  };

  return (
    <CalorieContext.Provider value={{ 
      entries, 
      addEntry, 
      removeEntry, 
      getTodaysCalories,
      getCaloriesForDate
    }}>
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalories = (): CalorieContextType => {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalories must be used within a CalorieProvider');
  }
  return context;
};