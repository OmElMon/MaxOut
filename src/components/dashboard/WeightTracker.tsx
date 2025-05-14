import React, { useState } from 'react';
import { Scale, Plus, TrendingUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { WeightEntry } from '../../types';

const WeightTracker: React.FC = () => {
  const { user, weightHistory, addWeightEntry } = useUser();
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newWeight, setNewWeight] = useState(user?.weight || 0);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newWeight <= 0) {
      return;
    }
    
    addWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weight: newWeight
    });
    
    setIsAddingEntry(false);
  };

  // Get progress stats
  const getWeightChange = () => {
    if (weightHistory.length < 2) return null;
    
    const latest = weightHistory[weightHistory.length - 1].weight;
    const earliest = weightHistory[0].weight;
    
    return {
      change: latest - earliest,
      percentage: ((latest - earliest) / earliest) * 100
    };
  };

  const weightChange = getWeightChange();
  const goalWeight = user?.goalWeight;
  const currentWeight = user?.weight;
  
  // Progress percentage towards goal
  const calculateGoalProgress = () => {
    if (!goalWeight || !currentWeight || weightHistory.length < 2) return 0;
    
    const startWeight = weightHistory[0].weight;
    
    // If goal is to lose weight
    if (goalWeight < startWeight) {
      const totalToLose = startWeight - goalWeight;
      const lostSoFar = startWeight - currentWeight;
      return Math.min(Math.max(0, (lostSoFar / totalToLose) * 100), 100);
    } 
    // If goal is to gain weight
    else if (goalWeight > startWeight) {
      const totalToGain = goalWeight - startWeight;
      const gainedSoFar = currentWeight - startWeight;
      return Math.min(Math.max(0, (gainedSoFar / totalToGain) * 100), 100);
    }
    
    return 100; // Already at goal
  };

  const goalProgress = calculateGoalProgress();

  // Format date string to display more nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Scale className="mr-2 text-blue-400" size={20} />
          Weight Tracker
        </h2>
        <button
          onClick={() => setIsAddingEntry(!isAddingEntry)}
          className="text-sm px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add Entry
        </button>
      </div>

      {/* Current Weight & Goal Display */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-indigo-800/30 p-4 rounded-lg text-center">
          <p className="text-blue-300 text-sm mb-1">Current</p>
          <p className="text-2xl font-bold text-white">{currentWeight} kg</p>
        </div>
        <div className="bg-indigo-800/30 p-4 rounded-lg text-center">
          <p className="text-blue-300 text-sm mb-1">Goal</p>
          <p className="text-2xl font-bold text-white">{goalWeight} kg</p>
        </div>
      </div>

      {/* Goal Progress */}
      {goalWeight && weightHistory.length >= 2 && (
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-300">Progress Toward Goal</span>
            <span className="text-blue-300">{Math.round(goalProgress)}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 rounded-full"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add New Entry Form */}
      {isAddingEntry && (
        <form onSubmit={handleAddWeight} className="mb-5 bg-indigo-800/30 p-4 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm text-blue-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={newWeight || ''}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
              placeholder="70"
              step="0.1"
              min="1"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => setIsAddingEntry(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Progress Summary */}
      {weightChange && (
        <div className={`mb-5 p-3 rounded-lg flex items-center ${
          weightChange.change < 0 ? 'bg-green-900/30' : weightChange.change > 0 ? 'bg-red-900/30' : 'bg-indigo-800/30'
        }`}>
          <TrendingUp className={`mr-3 ${
            weightChange.change < 0 ? 'text-green-400 rotate-180' : weightChange.change > 0 ? 'text-red-400' : 'text-blue-400'
          }`} />
          <div>
            <p className="text-white font-medium">
              {weightChange.change < 0 
                ? `Lost ${Math.abs(weightChange.change).toFixed(1)} kg` 
                : weightChange.change > 0 
                  ? `Gained ${weightChange.change.toFixed(1)} kg`
                  : 'Weight unchanged'
              }
            </p>
            <p className="text-sm text-blue-300">
              {Math.abs(weightChange.percentage).toFixed(1)}% {weightChange.change < 0 ? 'decrease' : 'increase'} since tracking
            </p>
          </div>
        </div>
      )}

      {/* Weight History */}
      <div>
        <h3 className="text-lg font-semibold text-blue-300 mb-2">
          History
        </h3>

        {weightHistory.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {[...weightHistory].reverse().map((entry, index) => (
              <div 
                key={entry.date} 
                className="flex items-center justify-between bg-indigo-900/30 rounded-lg p-3 border border-indigo-800/50"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center mr-3 text-white text-sm">
                    {weightHistory.length - index}
                  </div>
                  <div>
                    <p className="text-white font-medium">{entry.weight} kg</p>
                    <p className="text-sm text-blue-400">{formatDate(entry.date)}</p>
                  </div>
                </div>
                
                {index < weightHistory.length - 1 && (
                  <div className={`text-sm ${
                    entry.weight < weightHistory[weightHistory.length - index - 2].weight
                      ? 'text-green-400'
                      : entry.weight > weightHistory[weightHistory.length - index - 2].weight
                        ? 'text-red-400'
                        : 'text-blue-400'
                  }`}>
                    {entry.weight < weightHistory[weightHistory.length - index - 2].weight && '▼ '}
                    {entry.weight > weightHistory[weightHistory.length - index - 2].weight && '▲ '}
                    {Math.abs(entry.weight - weightHistory[weightHistory.length - index - 2].weight).toFixed(1)} kg
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p>No weight entries yet. Add your first entry!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;