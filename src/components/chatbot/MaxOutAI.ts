// Define types
export interface UserProfile {
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  days_per_week: number;
  available_equipment: string[];
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness';
  session_duration?: number;
}

export interface UserMetrics {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female' | 'other';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface Exercise {
  name: string;
  focus: string;
  equipment: string[];
  strength_focus: number;
  endurance_focus: number;
  calorie_burn: number;
  sets?: number;
  reps?: string;
  rest?: string;
}

export interface WorkoutPlan {
  [day: string]: {
    focus: string;
    exercises: Exercise[];
  };
}

export interface NutritionPlan {
  calories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

export class MaxOutAI {
  private exercises: Exercise[];

  constructor(exerciseDatabase?: Exercise[]) {
    // Initialize with default exercise database if none provided
    this.exercises = exerciseDatabase || this._getDefaultExercises();
  }

  /**
   * Generate a personalized workout plan based on user profile
   */
  public generateWorkoutPlan(userProfile: UserProfile): WorkoutPlan {
    const { days_per_week, fitness_level, available_equipment, goal } = userProfile;

    // Determine appropriate split
    const split = this._determineSplit(days_per_week);

    // Generate the plan
    const plan: WorkoutPlan = {};
    for (const [day, focus] of Object.entries(split)) {
      plan[day] = {
        focus,
        exercises: this._selectExercises(focus, fitness_level, available_equipment, goal)
      };
    }

    return plan;
  }

  /**
   * Calculate nutrition requirements based on user metrics
   */
  public calculateNutrition(userMetrics: UserMetrics): NutritionPlan {
    const { weight, height, age, gender, activity_level, goal } = userMetrics;

    // Calculate BMR
    let bmr: number;
    if (gender.toLowerCase() === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Apply activity multiplier
    const activityMultipliers: Record<string, number> = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };
    const tdee = bmr * (activityMultipliers[activity_level] || 1.55);

    // Adjust for goal
    const goalAdjustments: Record<string, number> = {
      'lose': -500,  // Calorie deficit
      'maintain': 0,
      'gain': 500    // Calorie surplus
    };
    const calorieTarget = tdee + (goalAdjustments[goal] || 0);

    // Calculate macros (example breakdown)
    const proteinRatio = 0.3;  // 30% of calories from protein
    const fatRatio = 0.25;     // 25% of calories from fat
    const carbRatio = 0.45;    // 45% of calories from carbs

    const proteinCalories = calorieTarget * proteinRatio;
    const fatCalories = calorieTarget * fatRatio;
    const carbCalories = calorieTarget * carbRatio;

    // Convert to grams
    const proteinGrams = proteinCalories / 4;  // 4 calories per gram of protein
    const fatGrams = fatCalories / 9;         // 9 calories per gram of fat
    const carbGrams = carbCalories / 4;        // 4 calories per gram of carbs

    return {
      calories: Math.round(calorieTarget),
      macros: {
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carbs: Math.round(carbGrams)
      }
    };
  }

  /**
   * Get a motivational message based on context
   */
  public getMotivationalMessage(context: string = 'general'): string {
    const messages: Record<string, string[]> = {
      'general': [
        "You're making great progress! Keep pushing forward.",
        "Every rep counts. Your future self will thank you.",
        "Consistency beats intensity. Show up every day.",
        "The only bad workout is the one that didn't happen."
      ],
      'missed_workout': [
        "Everyone misses a day sometimes. Get back on track tomorrow!",
        "Don't let one missed session become two. You've got this!",
        "Tomorrow is a new opportunity to crush your goals."
      ],
      'achievement': [
        "Incredible work! You're proving what you're capable of.",
        "This achievement is just the beginning. Keep building!",
        "Success isn't given, it's earned. And you earned this!"
      ]
    };

    const contextMessages = messages[context] || messages['general'];
    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  }

  // --- HELPER METHODS ---

  private _determineSplit(daysPerWeek: number): Record<string, string> {
    const splits: Record<number, Record<string, string>> = {
      1: { "Day 1": "Full Body" },
      2: { "Day 1": "Upper Body", "Day 2": "Lower Body" },
      3: { "Day 1": "Push", "Day 2": "Pull", "Day 3": "Legs" },
      4: { "Day 1": "Upper Body", "Day 2": "Lower Body", 
           "Day 3": "Upper Body", "Day 4": "Lower Body" },
      5: { "Day 1": "Chest/Triceps", "Day 2": "Back/Biceps", 
           "Day 3": "Legs", "Day 4": "Shoulders/Arms", "Day 5": "Full Body" },
      6: { "Day 1": "Chest", "Day 2": "Back", "Day 3": "Legs", 
           "Day 4": "Shoulders", "Day 5": "Arms", "Day 6": "Core/Cardio" }
    };
    return splits[daysPerWeek] || splits[3]; // Default to 3-day split
  }

  private _selectExercises(focus: string, fitnessLevel: string, equipment: string[], goal: string): Exercise[] {
    // Filter exercises matching the focus and equipment
    const matchingExercises = this.exercises.filter(e => 
      e.focus.toLowerCase().includes(focus.toLowerCase()) &&
      (e.equipment.length === 0 || e.equipment.some(eq => equipment.includes(eq)))
    );

    // Choose appropriate number of exercises based on fitness level
    const exerciseCounts: Record<string, number> = {
      'beginner': 4,
      'intermediate': 6,
      'advanced': 8
    };
    const count = exerciseCounts[fitnessLevel] || 5;

    // Prioritize exercises based on goal
    if (goal === 'strength') {
      matchingExercises.sort((a, b) => b.strength_focus - a.strength_focus);
    } else if (goal === 'endurance') {
      matchingExercises.sort((a, b) => b.endurance_focus - a.endurance_focus);
    } else if (goal === 'weight_loss') {
      matchingExercises.sort((a, b) => b.calorie_burn - a.calorie_burn);
    }

    // Select the exercises
    const selected = matchingExercises.length > 0 ? matchingExercises.slice(0, count) : [];

    // Add sets, reps, etc. based on goal and fitness level
    return selected.map(exercise => {
      const exerciseDetails = { ...exercise };

      // Determine sets and reps based on goal
      if (goal === 'strength') {
        exerciseDetails.sets = fitnessLevel === 'advanced' ? 4 : 3;
        exerciseDetails.reps = '4-6';
        exerciseDetails.rest = '2-3 min';
      } else if (goal === 'hypertrophy') {
        exerciseDetails.sets = 4;
        exerciseDetails.reps = '8-12';
        exerciseDetails.rest = '60-90 sec';
      } else if (goal === 'endurance') {
        exerciseDetails.sets = 3;
        exerciseDetails.reps = '15-20';
        exerciseDetails.rest = '30-45 sec';
      } else { // general fitness
        exerciseDetails.sets = 3;
        exerciseDetails.reps = '10-15';
        exerciseDetails.rest = '60 sec';
      }

      return exerciseDetails;
    });
  }

  private _getDefaultExercises(): Exercise[] {
    return [
      {
        name: 'Push-up',
        focus: 'Push, Chest, Triceps',
        equipment: [],
        strength_focus: 7,
        endurance_focus: 8,
        calorie_burn: 6
      },
      {
        name: 'Pull-up',
        focus: 'Pull, Back, Biceps',
        equipment: ['Pull-up Bar'],
        strength_focus: 9,
        endurance_focus: 7,
        calorie_burn: 7
      },
      {
        name: 'Squat',
        focus: 'Legs, Quadriceps, Glutes',
        equipment: [],
        strength_focus: 8,
        endurance_focus: 8,
        calorie_burn: 9
      },
      {
        name: 'Bench Press',
        focus: 'Push, Chest, Triceps',
        equipment: ['Bench', 'Barbell'],
        strength_focus: 9,
        endurance_focus: 6,
        calorie_burn: 7
      },
      {
        name: 'Deadlift',
        focus: 'Pull, Back, Legs',
        equipment: ['Barbell'],
        strength_focus: 10,
        endurance_focus: 7,
        calorie_burn: 10
      },
      {
        name: 'Dumbbell Row',
        focus: 'Pull, Back, Biceps',
        equipment: ['Dumbbells'],
        strength_focus: 8,
        endurance_focus: 7,
        calorie_burn: 6
      },
      {
        name: 'Overhead Press',
        focus: 'Push, Shoulders, Triceps',
        equipment: ['Barbell'],
        strength_focus: 8,
        endurance_focus: 6,
        calorie_burn: 6
      },
      {
        name: 'Lunges',
        focus: 'Legs, Quadriceps, Glutes',
        equipment: [],
        strength_focus: 7,
        endurance_focus: 8,
        calorie_burn: 8
      },
      {
        name: 'Plank',
        focus: 'Core',
        equipment: [],
        strength_focus: 6,
        endurance_focus: 9,
        calorie_burn: 5
      },
      {
        name: 'Burpees',
        focus: 'Full Body, Cardio',
        equipment: [],
        strength_focus: 6,
        endurance_focus: 10,
        calorie_burn: 10
      }
      // Add more exercises as needed
    ];
  }
}

export default MaxOutAI;