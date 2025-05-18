# server/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Exercise

# Database connection
DB_URI = "sqlite:///maxout.db"  # Replace with your actual database URI
engine = create_engine(DB_URI)
Session = sessionmaker(bind=engine)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(engine)
    
def get_db_session():
    """Get a database session"""
    return Session()

def seed_exercises():
    """Seed the exercise database with initial data"""
    session = get_db_session()
    
    # Check if we already have exercises
    if session.query(Exercise).count() > 0:
        session.close()
        return
    
    # Sample exercises
    exercises = [
        Exercise(
            name="Squat",
            description="A compound exercise that works primarily the quadriceps, hamstrings, and glutes.",
            muscle_groups="Quadriceps, Hamstrings, Glutes, Core",
            equipment="Barbell, Rack",
            difficulty="Intermediate"
        ),
        Exercise(
            name="Push-up",
            description="A bodyweight exercise that works the chest, shoulders, and triceps.",
            muscle_groups="Chest, Shoulders, Triceps, Core",
            equipment="None",
            difficulty="Beginner"
        ),
        # Add more exercises...
    ]
    
    session.add_all(exercises)
    session.commit()
    session.close()