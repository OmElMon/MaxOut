import React, { useState } from 'react';
// Importing icons from lucide-react
import { LineChart, BarChart, Calendar, ArrowUpRight, Dumbbell } from 'lucide-react';
// Importing user-defined context hooks
import { useUser } from '../../context/UserContext';
import { useCalories } from '../../context/CalorieContext';
import { useWorkout } from '../../context/WorkoutContext';

// Functional component for tracking progress
const ProgressTracker: React.FC = () => {
  // Access user data from context
  const { weightHistory, user } = useUser();
  const { entries, getCaloriesForDate } = useCalories();
  const { completedWorkouts } = useWorkout();

  // State to track selected time period (week, month, or all)
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Get filtered weight data based on selected period
  const getWeightChartData = () => {
    let filteredHistory = [...weightHistory];

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredHistory = weightHistory.filter(entry => new Date(entry.date) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredHistory = weightHistory.filter(entry => new Date(entry.date) >= monthAgo);
    }

    return filteredHistory;
  };

  // Get filtered calorie data for chart
  const getCalorieChartData = () => {
    const dates = new Set<string>();
    entries.forEach(entry => dates.add(entry.date));

    let filteredDates = Array.from(dates);
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredDates = filteredDates.filter(date => new Date(date) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredDates = filteredDates.filter(date => new Date(date) >= monthAgo);
    }

    filteredDates.sort();

    // Map dates to their respective calorie totals
    return filteredDates.map(date => ({
      date,
      calories: getCaloriesForDate(date)
    }));
  };

  // Get filtered workout data for chart
  const getWorkoutChartData = () => {
    // Extract dates from workout IDs
    const workoutDates = completedWorkouts.map(id => {
      const parts = id.split('-');
      return `${parts[parts.length - 3]}-${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
    });

    const workoutsPerDate: { [key: string]: number } = {};
    workoutDates.forEach(date => {
      workoutsPerDate[date] = (workoutsPerDate[date] || 0) + 1;
    });

    let filteredDates = Object.keys(workoutsPerDate);
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredDates = filteredDates.filter(date => new Date(date) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredDates = filteredDates.filter(date => new Date(date) >= monthAgo);
    }

    filteredDates.sort();

    return filteredDates.map(date => ({
      date,
      count: workoutsPerDate[date]
    }));
  };

  // Get chart data
  const weightData = getWeightChartData();
  const calorieData = getCalorieChartData();
  const workoutData = getWorkoutChartData();

  // Format date for display (e.g., "Apr 12")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Progress Tracker
            </span>
          </h1>
          <p className="text-blue-300">Track your fitness journey over time</p>
        </div>

        {/* Time Period Buttons */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 mb-8 shadow-lg border border-indigo-500/20">
          <div className="flex items-center mb-4">
            <Calendar className="text-blue-400 mr-2" size={20} />
            <h3 className="text-white font-bold">Time Period</h3>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-4">
            {['week', 'month', 'all'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p as 'week' | 'month' | 'all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
                }`}
              >
                {p === 'week' ? 'Last 7 Days' : p === 'month' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart components start here */}
          {/* Weight Chart */}
          {/* Calorie Chart */}
          {/* Workout Frequency Chart */}
          {/* Each chart includes dynamic bars based on respective data */}
          {/* ... (Your full chart rendering code continues here as-is) ... */}

          {/* Summary Section */}
          {/* Displays calculated weight progress, workout frequency, and goal progress */}
          {/* Renders only if user has goalWeight set */}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;