import React, { useState } from 'react';
import { LineChart, BarChart, Calendar, ArrowUpRight, Dumbbell } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useCalories } from '../../context/CalorieContext';
import { useWorkout } from '../../context/WorkoutContext';

const ProgressTracker: React.FC = () => {
  const { weightHistory, user } = useUser();
  const { entries, getCaloriesForDate } = useCalories();
  const { completedWorkouts } = useWorkout();
  
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  // Prepare data for weight chart
  const getWeightChartData = () => {
    // Filter data based on selected period
    let filteredHistory = [...weightHistory];
    
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredHistory = weightHistory.filter(entry => 
        new Date(entry.date) >= weekAgo
      );
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredHistory = weightHistory.filter(entry => 
        new Date(entry.date) >= monthAgo
      );
    }
    
    return filteredHistory;
  };
  
  // Prepare data for calorie chart
  const getCalorieChartData = () => {
    // Get unique dates from entries
    const dates = new Set<string>();
    entries.forEach(entry => dates.add(entry.date));
    
    // Filter dates based on selected period
    let filteredDates = Array.from(dates);
    
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredDates = filteredDates.filter(date => 
        new Date(date) >= weekAgo
      );
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredDates = filteredDates.filter(date => 
        new Date(date) >= monthAgo
      );
    }
    
    // Sort dates
    filteredDates.sort();
    
    // Calculate calories for each date
    return filteredDates.map(date => ({
      date,
      calories: getCaloriesForDate(date)
    }));
  };
  
  // Prepare data for workout chart
  const getWorkoutChartData = () => {
    // Extract dates from completed workouts
    const workoutDates = completedWorkouts.map(id => {
      const parts = id.split('-');
      return parts[parts.length - 3] + '-' + parts[parts.length - 2] + '-' + parts[parts.length - 1];
    });
    
    // Count workouts per date
    const workoutsPerDate: { [key: string]: number } = {};
    
    workoutDates.forEach(date => {
      workoutsPerDate[date] = (workoutsPerDate[date] || 0) + 1;
    });
    
    // Filter dates based on selected period
    let filteredDates = Object.keys(workoutsPerDate);
    
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredDates = filteredDates.filter(date => 
        new Date(date) >= weekAgo
      );
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredDates = filteredDates.filter(date => 
        new Date(date) >= monthAgo
      );
    }
    
    // Sort dates
    filteredDates.sort();
    
    return filteredDates.map(date => ({
      date,
      count: workoutsPerDate[date]
    }));
  };
  
  const weightData = getWeightChartData();
  const calorieData = getCalorieChartData();
  const workoutData = getWorkoutChartData();
  
  // Format date string to display more nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Progress Tracker
            </span>
          </h1>
          <p className="text-blue-300">Track your fitness journey over time</p>
        </div>
        
        {/* Time Period Filter */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 mb-8 shadow-lg border border-indigo-500/20">
          <div className="flex items-center mb-4">
            <Calendar className="text-blue-400 mr-2" size={20} />
            <h3 className="text-white font-bold">Time Period</h3>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Progress Chart */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <LineChart className="mr-2 text-blue-400" size={20} />
                Weight Progress
              </h2>
              
              {weightData.length >= 2 && (
                <div className={`flex items-center ${
                  weightData[weightData.length - 1].weight < weightData[0].weight
                    ? 'text-green-400'
                    : weightData[weightData.length - 1].weight > weightData[0].weight
                      ? 'text-red-400'
                      : 'text-blue-400'
                }`}>
                  <ArrowUpRight className={`mr-1 ${
                    weightData[weightData.length - 1].weight < weightData[0].weight && 'rotate-180'
                  }`} size={16} />
                  <span>
                    {Math.abs(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)} kg
                  </span>
                </div>
              )}
            </div>
            
            {weightData.length >= 2 ? (
              <div className="relative h-64">
                <div className="absolute inset-0">
                  {/* Weight Chart Visual */}
                  <div className="h-full flex items-end">
                    {weightData.map((entry, index) => {
                      // Calculate height percentage
                      const min = Math.min(...weightData.map(e => e.weight));
                      const max = Math.max(...weightData.map(e => e.weight));
                      const range = max - min;
                      const heightPercent = range === 0 
                        ? 50 
                        : ((entry.weight - min) / range) * 80 + 10;
                        
                      return (
                        <div key={entry.date} className="flex-1 flex flex-col items-center">
                          <div className="w-full px-1">
                            <div 
                              className={`w-full rounded-t-sm ${
                                index === weightData.length - 1 
                                  ? 'bg-blue-500'
                                  : 'bg-blue-500/60'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-blue-300 mt-2 rotate-45 origin-left">
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Not enough weight data to display chart</p>
              </div>
            )}
          </div>
          
          {/* Calorie Intake Chart */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
            <div className="flex items-center mb-6">
              <BarChart className="mr-2 text-green-400" size={20} />
              <h2 className="text-xl font-bold text-white">Calorie Intake</h2>
            </div>
            
            {calorieData.length > 0 ? (
              <div className="relative h-64">
                <div className="absolute inset-0">
                  {/* Calorie Chart Visual */}
                  <div className="h-full flex items-end">
                    {calorieData.map((entry) => {
                      // Calculate height percentage
                      const maxCalories = Math.max(...calorieData.map(e => e.calories));
                      const heightPercent = maxCalories === 0 
                        ? 0 
                        : (entry.calories / maxCalories) * 85;
                        
                      return (
                        <div key={entry.date} className="flex-1 flex flex-col items-center">
                          <div className="w-full px-1">
                            <div 
                              className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-blue-300 mt-2 rotate-45 origin-left">
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>No calorie data to display for selected period</p>
              </div>
            )}
          </div>
          
          {/* Workout Frequency Chart */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
            <div className="flex items-center mb-6">
              <Dumbbell className="mr-2 text-pink-400" size={20} />
              <h2 className="text-xl font-bold text-white">Workout Frequency</h2>
            </div>
            
            {workoutData.length > 0 ? (
              <div className="relative h-64">
                <div className="absolute inset-0">
                  {/* Workout Chart Visual */}
                  <div className="h-full flex items-end">
                    {workoutData.map((entry) => {
                      // Calculate height percentage
                      const maxCount = Math.max(...workoutData.map(e => e.count));
                      const heightPercent = maxCount === 0 
                        ? 0 
                        : (entry.count / maxCount) * 85;
                        
                      return (
                        <div key={entry.date} className="flex-1 flex flex-col items-center">
                          <div className="w-full px-1">
                            <div 
                              className="w-full bg-gradient-to-t from-pink-500 to-purple-400 rounded-t-sm"
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-blue-300 mt-2 rotate-45 origin-left">
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>No workout data to display for selected period</p>
              </div>
            )}
          </div>
          
          {/* Summary Stats */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
            <h2 className="text-xl font-bold text-white mb-6">Progress Summary</h2>
            
            <div className="space-y-6">
              {/* Weight Progress */}
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Weight</h3>
                {weightData.length >= 2 ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-800/30 p-3 rounded-lg">
                      <p className="text-sm text-blue-300 mb-1">Starting</p>
                      <p className="text-xl font-bold text-white">{weightData[0].weight} kg</p>
                    </div>
                    <div className="bg-indigo-800/30 p-3 rounded-lg">
                      <p className="text-sm text-blue-300 mb-1">Current</p>
                      <p className="text-xl font-bold text-white">{weightData[weightData.length - 1].weight} kg</p>
                    </div>
                    <div className="bg-indigo-800/30 p-3 rounded-lg col-span-2">
                      <p className="text-sm text-blue-300 mb-1">Change</p>
                      <p className={`text-xl font-bold ${
                        weightData[weightData.length - 1].weight < weightData[0].weight
                          ? 'text-green-400'
                          : weightData[weightData.length - 1].weight > weightData[0].weight
                            ? 'text-red-400'
                            : 'text-white'
                      }`}>
                        {weightData[weightData.length - 1].weight < weightData[0].weight && '-'}
                        {weightData[weightData.length - 1].weight > weightData[0].weight && '+'}
                        {Math.abs(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)} kg
                        {' '}
                        ({(Math.abs(weightData[weightData.length - 1].weight - weightData[0].weight) / weightData[0].weight * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Not enough data available</p>
                )}
              </div>
              
              {/* Workout Summary */}
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Workouts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-800/30 p-3 rounded-lg">
                    <p className="text-sm text-blue-300 mb-1">Completed</p>
                    <p className="text-xl font-bold text-white">{completedWorkouts.length}</p>
                  </div>
                  <div className="bg-indigo-800/30 p-3 rounded-lg">
                    <p className="text-sm text-blue-300 mb-1">This Week</p>
                    <p className="text-xl font-bold text-white">
                      {completedWorkouts.filter(id => {
                        const parts = id.split('-');
                        const date = parts[parts.length - 3] + '-' + parts[parts.length - 2] + '-' + parts[parts.length - 1];
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(date) >= weekAgo;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Goal Progress */}
              {user?.goalWeight && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Goal Progress</h3>
                  <div className="bg-indigo-800/30 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-blue-300">Weight Goal: {user.goalWeight} kg</span>
                      <span className="text-sm text-blue-300">
                        {weightData.length > 0 
                          ? Math.abs(weightData[weightData.length - 1].weight - user.goalWeight).toFixed(1)
                          : Math.abs(user.weight - user.goalWeight).toFixed(1)
                        } kg to go
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"
                        style={{ 
                          width: weightData.length >= 2 
                            ? `${Math.min(Math.max(0, ((weightData[0].weight - weightData[weightData.length - 1].weight) / (weightData[0].weight - user.goalWeight)) * 100), 100)}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;