from flask import Blueprint, request, jsonify
from ai_engine import MaxOutAI
from database import get_db_session, Exercise
from models import WorkoutLog

# Initialize DB and AI
api = Blueprint('api', __name__)
session = get_db_session()
exercise_db = session.query(Exercise).all()

ai_engine = MaxOutAI(db_connection=session, exercise_db=exercise_db, nutrition_db=None)

@api.route('/workout/generate', methods=['POST'])
def generate_workout():
    user_profile = request.json
    try:
        plan = ai_engine.generate_workout_plan(user_profile)
        return jsonify({"success": True, "plan": plan})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@api.route('/nutrition/calculate', methods=['POST'])
def calculate_nutrition():
    user_data = request.json
    try:
        result = ai_engine.calculate_nutrition_needs(
            user_data.get('metrics'),
            user_data.get('activity_level'),
            user_data.get('goal')
        )
        return jsonify({"success": True, "plan": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@api.route('/progress/log', methods=['POST'])
def log_progress():
    log_data = request.json
    try:
        ai_engine.log_workout(
            log_data.get('user_id'),
            log_data.get('workout_data')
        )
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@api.route('/progress/stats/<user_id>', methods=['GET'])
def get_stats(user_id):
    try:
        session = get_db_session()
        
        logs = session.query(WorkoutLog).filter_by(user_id=user_id).all()
        total_sessions = len(logs)
        total_duration = sum(log.duration for log in logs) if logs else 0
        avg_duration = total_duration / total_sessions if total_sessions > 0 else 0

        # Count exercise frequency
        exercise_counts = {}
        for log in logs:
            for ex_log in log.exercises:
                exercise = session.query(Exercise).get(ex_log.exercise_id)
                if exercise:
                    name = exercise.name
                    exercise_counts[name] = exercise_counts.get(name, 0) + 1

        most_common = sorted(exercise_counts.items(), key=lambda x: x[1], reverse=True)

        return jsonify({
            "success": True,
            "stats": {
                "total_workouts": total_sessions,
                "average_duration": round(avg_duration, 2),
                "most_frequent_exercises": most_common
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api.route('/motivation', methods=['GET'])
def get_motivation():
    context = request.args.get('context', 'general')
    try:
        message = ai_engine.generate_motivation({}, context)
        return jsonify({"success": True, "message": message})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400