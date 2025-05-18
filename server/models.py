# server/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    workout_logs = relationship("WorkoutLog", back_populates="user")
    
class UserProfile(Base):
    __tablename__ = 'user_profiles'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    age = Column(Integer)
    weight = Column(Float)  # in kg
    height = Column(Float)  # in cm
    fitness_level = Column(String(20))
    goals = Column(String(100))
    available_equipment = Column(Text)  # JSON string of equipment
    days_per_week = Column(Integer)
    session_duration = Column(Integer)  # in minutes
    
    user = relationship("User", back_populates="profile")

class Exercise(Base):
    __tablename__ = 'exercises'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    muscle_groups = Column(String(200))
    equipment = Column(String(200))
    difficulty = Column(String(20))
    
class WorkoutLog(Base):
    __tablename__ = 'workout_logs'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(Integer)  # in minutes
    notes = Column(Text)
    
    user = relationship("User", back_populates="workout_logs")
    exercises = relationship("ExerciseLog", back_populates="workout")
    
class ExerciseLog(Base):
    __tablename__ = 'exercise_logs'
    
    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey('workout_logs.id'))
    exercise_id = Column(Integer, ForeignKey('exercises.id'))
    sets = Column(Integer)
    reps = Column(String(50))  # Store as JSON string to allow different reps per set
    weight = Column(String(50))  # Store as JSON string to allow different weights per set
    
    workout = relationship("WorkoutLog", back_populates="exercises")