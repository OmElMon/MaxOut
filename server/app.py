from flask import Flask
from flask_cors import CORS
from server.routes import api
from server.database import init_db, seed_exercises

def create_app():
    app = Flask(__name__)
    
    # Enable CORS (for React frontend to communicate with Flask API)
    CORS(app)

    # Register API routes
    app.register_blueprint(api, url_prefix='/api')

    # Initialize DB and seed if needed
    init_db()
    seed_exercises()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)  # Change port as needed