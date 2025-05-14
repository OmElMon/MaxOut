import React, { useState } from "react";
import { Apple, Plus, Trash2 } from "lucide-react";
import { useCalories } from "../../context/CalorieContext";
import { useUser } from "../../context/UserContext";

/**
 * CalorieTracker component provides an interface for users to:
 * - Track daily calorie intake
 * - Add food entries categorized by meal type
 * - View progress toward daily calorie goal
 * - Remove existing entries
 */
const CalorieTracker: React.FC = () => {
  // Access calorie tracking context methods and data
  const { entries, addEntry, removeEntry, getTodaysCalories } = useCalories();

  // Access user data for calorie goal
  const { user } = useUser();

  // State for controlling the add entry form visibility
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // State for managing new entry form data
  const [newEntry, setNewEntry] = useState({
    food: "",
    calories: 0,
    mealType: "snack" as "breakfast" | "lunch" | "dinner" | "snack",
  });

  /**
   * Handles form submission for adding a new food entry
   * @param {React.FormEvent} e - Form submission event
   */
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (newEntry.food.trim() === "" || newEntry.calories <= 0) {
      return;
    }

    // Add entry with current date
    addEntry({
      ...newEntry,
      date: new Date().toISOString().split("T")[0],
    });

    // Reset form fields
    setNewEntry({
      food: "",
      calories: 0,
      mealType: "snack",
    });

    // Close the form
    setIsAddingEntry(false);
  };

  // Filter entries for today's date
  const todaysEntries = entries.filter(
    (entry) => entry.date === new Date().toISOString().split("T")[0]
  );

  // Calculate calorie metrics
  const totalCalories = getTodaysCalories();
  const calorieGoal = user?.dailyCalorieGoal || 2000; // Default to 2000 if no goal set
  const caloriePercentage = Math.min(
    Math.round((totalCalories / calorieGoal) * 100),
    100
  );

  // Group entries by meal type for organized display
  const mealGroups = {
    breakfast: todaysEntries.filter((entry) => entry.mealType === "breakfast"),
    lunch: todaysEntries.filter((entry) => entry.mealType === "lunch"),
    dinner: todaysEntries.filter((entry) => entry.mealType === "dinner"),
    snack: todaysEntries.filter((entry) => entry.mealType === "snack"),
  };

  return (
    <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
      {/* Header section with title and add button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Apple className="mr-2 text-green-400" size={20} />
          Calorie Tracker
        </h2>
        <button
          onClick={() => setIsAddingEntry(!isAddingEntry)}
          className="text-sm px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add Food
        </button>
      </div>

      {/* Calorie progress visualization */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-blue-300">{totalCalories} kcal</span>
          <span className="text-blue-300">Goal: {calorieGoal} kcal</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              caloriePercentage > 100
                ? "bg-red-500" // Over goal - red
                : caloriePercentage > 85
                ? "bg-yellow-500" // Close to goal - yellow
                : "bg-green-500" // Under goal - green
            }`}
            style={{ width: `${caloriePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Add New Entry Form (conditionally rendered) */}
      {isAddingEntry && (
        <form
          onSubmit={handleAddEntry}
          className="mb-6 bg-indigo-800/30 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-3">
            {/* Food name input */}
            <div>
              <label className="block text-sm text-blue-300 mb-1">Food</label>
              <input
                type="text"
                value={newEntry.food}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, food: e.target.value })
                }
                className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                placeholder="e.g. Apple, Rice Bowl"
                required
              />
            </div>
            {/* Calories input */}
            <div>
              <label className="block text-sm text-blue-300 mb-1">
                Calories
              </label>
              <input
                type="number"
                value={newEntry.calories || ""}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, calories: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                placeholder="100"
                min="1"
                required
              />
            </div>
          </div>

          {/* Meal type selector */}
          <div className="mb-3">
            <label className="block text-sm text-blue-300 mb-1">
              Meal Type
            </label>
            <select
              value={newEntry.mealType}
              onChange={(e) =>
                setNewEntry({ ...newEntry, mealType: e.target.value as any })
              }
              className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Form action buttons */}
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

      {/* Food Entries List grouped by meal type */}
      <div>
        {/* Render each meal group that has entries */}
        {Object.entries(mealGroups).map(
          ([mealType, entries]) =>
            entries.length > 0 && (
              <div key={mealType} className="mb-4">
                {/* Meal type heading */}
                <h3 className="text-lg font-semibold text-blue-300 capitalize mb-2">
                  {mealType}
                </h3>
                {/* List of entries for this meal type */}
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between bg-indigo-900/30 rounded-lg p-3 border border-indigo-800/50"
                    >
                      {/* Entry details */}
                      <div>
                        <p className="text-white font-medium">{entry.food}</p>
                        <p className="text-sm text-blue-400">
                          {entry.calories} kcal
                        </p>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="text-gray-400 hover:text-red-400 transition"
                        aria-label="Remove entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Empty state message */}
        {todaysEntries.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <p>No food entries for today. Start tracking your meals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieTracker;
