import React, { useState } from 'react';
import { Dumbbell, Filter, Clock, ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useUser } from '../../context/UserContext';
import { WorkoutPlan } from '../../types';

const WorkoutPlans: React.FC = () => {
  const { workoutPlans, selectWorkoutPlan, completeWorkout } = useWorkout();
  const { updateAchievementProgress } = useUser();
  
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  
  // Filter workouts based on difficulty selection
  const filteredPlans = workoutPlans.filter(plan => 
    filter === 'all' || plan.difficulty === filter
  );

  const handleSelectWorkout = (plan: WorkoutPlan) => {
    selectWorkoutPlan(plan.id);
    setSelectedWorkout(plan);
  };

  const handleCompleteWorkout = (id: string) => {
    completeWorkout(id);
    setSelectedWorkout(null);
    
    // Update power-up achievement progress if it's strength training
    const plan = workoutPlans.find(p => p.id === id);
    if (plan?.name.toLowerCase().includes('strength')) {
      updateAchievementProgress('power-up', 1);
    }
  };

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
              Workout Plans
            </span>
          </h1>
          <p className="text-blue-300">Find the perfect routine for your fitness goals</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 mb-8 shadow-lg border border-indigo-500/20">
          <div className="flex items-center mb-4">
            <Filter className="text-blue-400 mr-2" size={20} />
            <h3 className="text-white font-bold">Filter by Difficulty</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilter('beginner')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'beginner' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilter('intermediate')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'intermediate' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilter('advanced')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'advanced' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-indigo-900/50 text-blue-300 hover:bg-indigo-800'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Workout Plans List */}
        {selectedWorkout ? (
          // Workout Detail View
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-indigo-500/20">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-800 p-6">
              <button
                onClick={() => setSelectedWorkout(null)}
                className="text-blue-300 hover:text-white mb-4 flex items-center transition-colors"
              >
                <ArrowRight className="rotate-180 mr-1" size={16} />
                Back to Workouts
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2">{selectedWorkout.name}</h2>
              <p className="text-blue-300 mb-4">{selectedWorkout.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="bg-indigo-800/50 px-3 py-1 rounded-full text-white text-sm flex items-center">
                  <Clock size={14} className="mr-1" />
                  {selectedWorkout.duration} min
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm ${
                  selectedWorkout.difficulty === 'beginner' 
                    ? 'bg-green-600/50' 
                    : selectedWorkout.difficulty === 'intermediate'
                      ? 'bg-yellow-600/50'
                      : 'bg-red-600/50'
                }`}>
                  {selectedWorkout.difficulty.charAt(0).toUpperCase() + selectedWorkout.difficulty.slice(1)}
                </div>
                {selectedWorkout.targetMuscleGroups.map(group => (
                  <div key={group} className="bg-indigo-800/50 px-3 py-1 rounded-full text-white text-sm">
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleCompleteWorkout(selectedWorkout.id)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Mark as Complete
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Exercises</h3>
              
              <div className="space-y-4">
                {selectedWorkout.exercises.map((exercise, index) => (
                  <WorkoutExercise key={exercise.id} exercise={exercise} index={index} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Workout List View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.length > 0 ? (
              filteredPlans.map(plan => (
                <div 
                  key={plan.id}
                  className="bg-indigo-900/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-indigo-500/20 transition-transform hover:scale-[1.02] duration-300"
                >
                  <div className={`h-2 ${
                    plan.difficulty === 'beginner' 
                      ? 'bg-green-500' 
                      : plan.difficulty === 'intermediate'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`} />
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-blue-300 mb-4">{plan.description}</p>
                    
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <div className="bg-indigo-800/50 px-3 py-1 rounded-full text-white text-sm flex items-center">
                        <Clock size={14} className="mr-1" />
                        {plan.duration} min
                      </div>
                      <div className={`px-3 py-1 rounded-full text-white text-sm ${
                        plan.difficulty === 'beginner' 
                          ? 'bg-green-600/50' 
                          : plan.difficulty === 'intermediate'
                            ? 'bg-yellow-600/50'
                            : 'bg-red-600/50'
                      }`}>
                        {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-blue-300">
                        {plan.exercises.length} exercises
                      </div>
                      <button
                        onClick={() => handleSelectWorkout(plan)}
                        className="flex items-center text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                <Dumbbell size={48} className="mx-auto mb-4 opacity-30" />
                <p>No workout plans match your filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface WorkoutExerciseProps {
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    muscleGroup: string;
    description: string;
  };
  index: number;
}

const WorkoutExercise: React.FC<WorkoutExerciseProps> = ({ exercise, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-indigo-800/30 rounded-lg border border-indigo-700/40">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="bg-indigo-700/60 h-8 w-8 rounded-full flex items-center justify-center mr-3 text-white font-bold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-bold text-white">{exercise.name}</h4>
            <p className="text-sm text-blue-300">{exercise.sets} sets × {exercise.reps} reps</p>
          </div>
        </div>
        <button className="text-blue-300">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-0 text-blue-300 border-t border-indigo-700/40">
          <p className="mb-2">{exercise.description}</p>
          <div className="text-sm">
            <span className="bg-indigo-900/50 px-2 py-1 rounded-md">
              Targets: {exercise.muscleGroup}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans;