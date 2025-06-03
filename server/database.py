# server/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Exercise

# Database connection
DB_URI = "sqlite:///maxout.db"
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

    exercises = [
        Exercise(
            name="Squat",
            description="A compound exercise that works the quadriceps, hamstrings, and glutes.",
            muscle_groups="Legs, Glutes, Hamstrings",
            equipment="Barbell, Rack",
            difficulty="Intermediate"
        ),
        Exercise(
            name="Push-up",
            description="Bodyweight exercise that works chest, shoulders, and triceps.",
            muscle_groups="Push, Chest, Triceps",
            equipment="Bodyweight",
            difficulty="Beginner"
        ),
        Exercise(
            name="Dumbbell Row",
            description="Pull exercise for the upper back using dumbbells.",
            muscle_groups="Pull, Back, Biceps",
            equipment="Dumbbells",
            difficulty="Beginner"
        ),
        Exercise(
            name="Lunge",
            description="Bodyweight or dumbbell exercise targeting legs and glutes.",
            muscle_groups="Legs, Glutes, Hamstrings",
            equipment="Bodyweight, Dumbbells",
            difficulty="Beginner"
        ),
        Exercise(
            name="Goblet Squat",
            description="Dumbbell-based leg and core workout.",
            muscle_groups="Legs, Core, Quads",
            equipment="Dumbbells",
            difficulty="Beginner"
        ),
        Exercise(
            name="Overhead Press",
            description="Push exercise targeting shoulders and arms.",
            muscle_groups="Push, Shoulders, Triceps",
            equipment="Dumbbells, Barbell",
            difficulty="Intermediate"
        ),
        Exercise(
            name="Step-up",
            description="Leg/glute exercise using bodyweight or dumbbells.",
            muscle_groups="Legs, Glutes",
            equipment="Bodyweight, Dumbbells, Bench",
            difficulty="Beginner"
        ),
        Exercise(
            name="Plank",
            description="Core strengthening hold.",
            muscle_groups="Core, Abs",
            equipment="Bodyweight",
            difficulty="Beginner"
        )
    ]

    session.add_all(exercises)
    session.commit()
    session.close()