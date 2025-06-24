# server/init_db.py

from database import Base, engine
from models import Exercise  # include other models too if needed

# Create all tables in the database
Base.metadata.create_all(bind=engine)

print("✅ Tables created.")