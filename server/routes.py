from flask import Blueprint, request, jsonify
from .ai_engine import MaxOutAI
from .database import get_db_session, Exercise

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
    metric = request.args.get('metric', 'strength')
    time_range = request.args.get('time_range', '30days')
    try:
        stats = ai_engine.get_progress(user_id, metric, time_range)
        return jsonify({"success": True, "stats": stats})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@api.route('/motivation', methods=['GET'])
def get_motivation():
    context = request.args.get('context', 'general')
    try:
        message = ai_engine.generate_motivation({}, context)
        return jsonify({"success": True, "message": message})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400