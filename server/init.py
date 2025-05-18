from server.database import init_db, seed_exercises

init_db()
seed_exercises()
print("✅ Database initialized and exercises seeded.")