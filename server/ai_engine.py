import random

class MaxOutAI:
    """Main AI engine for MaxOut personal trainer"""

    def __init__(self, db_connection=None, exercise_db=None, nutrition_db=None):
        self.db = db_connection
        self.exercise_db = exercise_db or self._get_default_exercises()
        self.nutrition_db = nutrition_db

    # --- WORKOUT GENERATION METHODS ---

    def generate_workout_plan(self, user_profile):
        days_per_week = user_profile.get('days_per_week', 3)
        split = self._determine_split(days_per_week)

        workout_plan = {}
        for day, focus in split.items():
            workout_plan[day] = self._generate_day_workout(
                focus=focus,
                fitness_level=user_profile.get('fitness_level', 'beginner'),
                equipment=user_profile.get('available_equipment', []),
                duration=user_profile.get('session_duration', 60)
            )

        return workout_plan

    def _determine_split(self, days_per_week):
        splits = {
            1: {"Day 1": "Full Body"},
            2: {"Day 1": "Upper Body", "Day 2": "Lower Body"},
            3: {"Day 1": "Push", "Day 2": "Pull", "Day 3": "Legs"},
            4: {"Day 1": "Upper", "Day 2": "Lower", "Day 3": "Push", "Day 4": "Pull"},
        }
        return splits.get(days_per_week, splits[3])

    def _generate_day_workout(self, focus, fitness_level, equipment, duration):
        level_map = {"beginner": 4, "intermediate": 6, "advanced": 8}
        target_count = level_map.get(fitness_level, 5)

        equipment_lower = [e.lower() for e in equipment]

        filtered = []
        for ex in self.exercise_db:
            focus_match = focus.lower() in ex.muscle_groups.lower()

            equipment_list = [e.strip().lower() for e in ex.equipment.split(',')] if ex.equipment else []
            equipment_match = not equipment_list or any(eq in equipment_lower for eq in equipment_list)

            if focus_match and equipment_match:
                filtered.append({
                    "name": ex.name,
                    "description": ex.description,
                    "equipment": ex.equipment,
                    "difficulty": ex.difficulty
                })

        return random.sample(filtered, min(len(filtered), target_count))

    # --- PROGRESS TRACKING METHODS ---

    def log_workout(self, user_id, workout_data):
        if self.db:
            self.db.insert_workout(user_id, workout_data)

    def get_progress(self, user_id, metric, time_range):
        if self.db:
            return self.db.fetch_progress(user_id, metric, time_range)
        return {}

    # --- NUTRITION METHODS ---

    def calculate_nutrition_needs(self, user_metrics, activity_level, goal):
        bmr = self._calculate_bmr(user_metrics)
        tdee = bmr * self._get_activity_multiplier(activity_level)
        calorie_target = self._adjust_for_goal(tdee, goal)
        macros = self._calculate_macros(calorie_target, goal)

        return {
            'calorie_target': round(calorie_target),
            'macros': macros
        }

    def _calculate_bmr(self, user_metrics):
        weight = user_metrics.get('weight', 70)
        height = user_metrics.get('height', 170)
        age = user_metrics.get('age', 30)
        gender = user_metrics.get('gender', 'male')

        if gender.lower() == 'male':
            return (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            return (10 * weight) + (6.25 * height) - (5 * age) - 161

    def _get_activity_multiplier(self, level):
        multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        }
        return multipliers.get(level.lower(), 1.55)

    def _adjust_for_goal(self, tdee, goal):
        goals = {
            'lose': -500,
            'maintain': 0,
            'gain': 500
        }
        return tdee + goals.get(goal, 0)

    def _calculate_macros(self, calories, goal):
        return {
            'protein': round((calories * 0.3) / 4),
            'fat': round((calories * 0.25) / 9),
            'carbs': round((calories * 0.45) / 4)
        }

    # --- MOTIVATION METHODS ---

    def generate_motivation(self, user_profile=None, context='general'):
        messages = {
            'general': [
                "You're doing great, keep showing up!",
                "Every rep counts. Stay consistent.",
                "The hardest part is starting — you're already ahead."
            ],
            'missed_workout': [
                "One day off won’t stop progress. Let’s get back to it!",
                "Missed a day? Shake it off and go again tomorrow."
            ],
            'achievement': [
                "Amazing work! You crushed it today.",
                "You’re leveling up — keep pushing!"
            ]
        }
        return random.choice(messages.get(context, messages['general']))

    def get_workout_reminder(self, user_id, scheduled_workout):
        return f"Hey! Don't forget today's {scheduled_workout}. You're going to crush it!"

    # --- Default Exercises ---

    def _get_default_exercises(self):
        return [
            {"name": "Push-up", "focus": "Push", "equipment": []},
            {"name": "Pull-up", "focus": "Pull", "equipment": ["Pull-up Bar"]},
            {"name": "Squat", "focus": "Legs", "equipment": []},
            {"name": "Lunge", "focus": "Legs", "equipment": []},
            {"name": "Dumbbell Row", "focus": "Pull", "equipment": ["Dumbbells"]},
            {"name": "Overhead Press", "focus": "Push", "equipment": ["Barbell"]},
            {"name": "Burpees", "focus": "Full Body", "equipment": []},
            {"name": "Plank", "focus": "Core", "equipment": []}
        ]