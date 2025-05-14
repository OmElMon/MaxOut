import React, { useState } from 'react';
import { Apple, Search, Filter, ChevronDown, Info } from 'lucide-react';
import { useCalories } from '../../context/CalorieContext';

/**
 * Interface defining the structure of a food item
 */
interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}

/**
 * Sample food database containing nutritional information
 * for various food items categorized by type
 */
const foodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'White Rice (100g)',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    category: 'grains'
  },
  // ... other food items
];

/**
 * NutritionPage component provides:
 * - Food database search functionality
 * - Nutritional information display
 * - Meal tracking capabilities
 */
const NutritionPage: React.FC = () => {
  // Access calorie tracking context
  const { addEntry } = useCalories();
  
  // State for search term filtering
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // State for selected food item
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  // State for serving size input
  const [servingSize, setServingSize] = useState<number>(100);
  
  // State for meal type selection
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');

  /**
   * Filters foods based on search term and selected category
   */
  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Handles adding the selected food to the calorie tracker
   * Calculates nutritional values based on serving size
   */
  const handleAddFood = () => {
    if (!selectedFood) return;

    // Calculate nutritional values based on serving size
    const multiplier = servingSize / 100;
    addEntry({
      food: `${selectedFood.name} (${servingSize}g)`,
      calories: Math.round(selectedFood.calories * multiplier),
      date: new Date().toISOString().split('T')[0],
      mealType
    });

    // Reset form after adding
    setSelectedFood(null);
    setServingSize(100);
    setMealType('snack');
  };

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto max-w-4xl">
        {/* Page header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Nutrition Guide
            </span>
          </h1>
          <p className="text-blue-300">Track your meals and discover nutritional information</p>
        </div>

        {/* Search and filter controls */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 mb-8 shadow-lg border border-indigo-500/20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input with icon */}
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
            </div>
            
            {/* Category filter dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-40 px-4 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white appearance-none"
              >
                <option value="all">All Types</option>
                <option value="protein">Protein</option>
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
              </select>
              <Filter size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Food items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredFoods.map(food => (
            <div
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className={`bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border transition-all cursor-pointer ${
                selectedFood?.id === food.id
                  ? 'border-green-500/50 scale-[1.02]' // Selected food style
                  : 'border-indigo-500/20 hover:border-green-500/30' // Default/hover style
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white">{food.name}</h3>
                <span className="text-green-400 font-bold">{food.calories} kcal</span>
              </div>
              
              {/* Nutritional info grid */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-indigo-800/30 rounded-lg p-2 text-center">
                  <p className="text-blue-300">Protein</p>
                  <p className="text-white font-bold">{food.protein}g</p>
                </div>
                <div className="bg-indigo-800/30 rounded-lg p-2 text-center">
                  <p className="text-blue-300">Carbs</p>
                  <p className="text-white font-bold">{food.carbs}g</p>
                </div>
                <div className="bg-indigo-800/30 rounded-lg p-2 text-center">
                  <p className="text-blue-300">Fat</p>
                  <p className="text-white font-bold">{food.fat}g</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty state when no foods match search */}
          {filteredFoods.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              <Apple size={48} className="mx-auto mb-4 opacity-30" />
              <p>No foods match your search criteria.</p>
            </div>
          )}
        </div>

        {/* Add Food Form (shown when food is selected) */}
        {selectedFood && (
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Apple className="mr-2 text-green-400" size={20} />
              Add to Tracker
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Serving size input */}
              <div>
                <label className="block text-sm text-blue-300 mb-1">Serving Size (g)</label>
                <input
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                  min="1"
                />
              </div>
              
              {/* Meal type selector */}
              <div>
                <label className="block text-sm text-blue-300 mb-1">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>
            
            {/* Nutritional info summary */}
            <div className="bg-indigo-800/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300">Calories:</span>
                <span className="text-white font-bold">
                  {Math.round(selectedFood.calories * (servingSize / 100))} kcal
                </span>
              </div>
              {/* ... other nutritional info displays ... */}
            </div>
            
            {/* Form action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleAddFood}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex-grow"
              >
                Add to Tracker
              </button>
              <button
                onClick={() => setSelectedFood(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPage;